/**
 * ভিডিও আপলোড (ব্রাউজারে) — টুকরো টুকরো, ২ GB পর্যন্ত:
 *  ১) /api/backend/media/uploads          → আপলোড শুরু (টুকরোর সংখ্যা ও সাইজ)
 *  ২) /api/backend/media/{id}/parts       → টুকরোগুলোর মেয়াদি লিংক (একবারে ২০টা)
 *  ৩) প্রতিটা টুকরো সরাসরি লিংকে PUT — একসাথে ৩টা; ব্যর্থ হলে শুধু সেটা ৩ বার পর্যন্ত আবার
 *  ৪) /api/backend/media/{id}/complete    → সার্ভার জোড়া লাগিয়ে যাচাই করে "ready"
 */

export const MAX_UPLOAD_MB = 2048;
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'] as const;

const PARALLEL_PARTS = 3;
const URL_BATCH_SIZE = 20;
const MAX_PART_ATTEMPTS = 4;

export interface MediaFile {
  id: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  duration_seconds: number | null;
  width: number | null;
  height: number | null;
  status: 'pending' | 'uploaded' | 'processing' | 'ready' | 'failed';
  created_at: string | null;
}

export class UploadError extends Error {}

interface ApiBody<T> {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

interface CompletedPart {
  part_number: number;
  etag: string;
}

async function backend<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/backend/${path}`, {
      ...init,
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    });
  } catch {
    throw new UploadError('Network error. Please check your connection.');
  }

  const body = (await response.json().catch(() => ({}))) as ApiBody<T>;
  if (!response.ok || body.data === undefined) {
    const firstFieldError = body.errors ? Object.values(body.errors)[0]?.[0] : undefined;
    throw new UploadError(firstFieldError ?? body.message ?? 'Upload failed.');
  }
  return body.data;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** ব্রাউজারে ভিডিওর দৈর্ঘ্য ও মাপ বের করা (শুধু তথ্যের জন্য) */
function readVideoMeta(file: File): Promise<{ duration_seconds: number | null; width: number | null; height: number | null }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    const done = (meta: { duration_seconds: number | null; width: number | null; height: number | null }) => {
      URL.revokeObjectURL(url);
      resolve(meta);
    };
    const timer = window.setTimeout(() => done({ duration_seconds: null, width: null, height: null }), 10_000);

    video.preload = 'metadata';
    video.muted = true;
    video.onloadedmetadata = () => {
      window.clearTimeout(timer);
      done({
        duration_seconds: Number.isFinite(video.duration) ? Math.round(video.duration) : null,
        width: video.videoWidth || null,
        height: video.videoHeight || null,
      });
    };
    video.onerror = () => {
      window.clearTimeout(timer);
      done({ duration_seconds: null, width: null, height: null });
    };
    video.src = url;
  });
}

/** একটা টুকরো পাঠানো; সফল হলে ETag ফেরত */
function putPart(url: string, blob: Blob, onBytes: (loaded: number) => void, signal: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new UploadError('Upload cancelled.'));
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);

    xhr.upload.onprogress = (event) => onBytes(event.loaded);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let etag = xhr.getResponseHeader('ETag');
        if (!etag) {
          try {
            etag = (JSON.parse(xhr.responseText) as { data?: { etag?: string } }).data?.etag ?? null;
          } catch {
            etag = null;
          }
        }
        if (etag) resolve(etag);
        else reject(new UploadError('Upload response was incomplete.'));
      } else {
        reject(new UploadError(`Upload failed (${xhr.status}).`));
      }
    };
    xhr.onerror = () => reject(new UploadError('Upload failed. Please check your connection.'));
    xhr.onabort = () => reject(new UploadError('Upload cancelled.'));

    signal.addEventListener('abort', () => xhr.abort(), { once: true });
    xhr.send(blob);
  });
}

export function validateVideoFile(file: File): string | null {
  if (!(ALLOWED_VIDEO_TYPES as readonly string[]).includes(file.type)) {
    return 'Only MP4, MOV and WebM videos are supported.';
  }
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    return 'The video must not be larger than 2 GB.';
  }
  if (file.size === 0) {
    return 'The selected file is empty.';
  }
  return null;
}

export async function uploadVideo(
  file: File,
  onProgress: (percent: number) => void,
  signal: AbortSignal,
): Promise<MediaFile> {
  const invalid = validateVideoFile(file);
  if (invalid) throw new UploadError(invalid);

  const meta = await readVideoMeta(file);

  const { media, upload } = await backend<{ media: MediaFile; upload: { part_size: number; part_count: number } }>(
    'media/uploads',
    {
      method: 'POST',
      body: JSON.stringify({ filename: file.name, size: file.size, mime_type: file.type }),
      signal,
    },
  );

  const { part_size: partSize, part_count: partCount } = upload;
  const loadedPerPart = new Array<number>(partCount + 1).fill(0);
  const reportProgress = () => {
    const loaded = loadedPerPart.reduce((sum, value) => sum + value, 0);
    onProgress(Math.min(99, Math.floor((loaded / file.size) * 100)));
  };

  // টুকরোর লিংক — দরকার মতো ২০টা করে আনা হয়
  const urlCache = new Map<number, string>();
  const getUrl = async (partNumber: number, forceFresh = false): Promise<string> => {
    if (!forceFresh && urlCache.has(partNumber)) return urlCache.get(partNumber)!;

    const batch: number[] = [];
    for (let n = partNumber; n <= partCount && batch.length < URL_BATCH_SIZE; n++) {
      if (forceFresh || !urlCache.has(n)) batch.push(n);
    }
    const { parts } = await backend<{ parts: { part_number: number; url: string }[] }>(`media/${media.id}/parts`, {
      method: 'POST',
      body: JSON.stringify({ part_numbers: batch }),
      signal,
    });
    parts.forEach((part) => urlCache.set(part.part_number, part.url));

    const url = urlCache.get(partNumber);
    if (!url) throw new UploadError('Could not prepare upload.');
    return url;
  };

  const uploadOne = async (partNumber: number): Promise<CompletedPart> => {
    const start = (partNumber - 1) * partSize;
    const blob = file.slice(start, Math.min(start + partSize, file.size));

    for (let attempt = 1; attempt <= MAX_PART_ATTEMPTS; attempt++) {
      try {
        const url = await getUrl(partNumber, attempt > 1);
        const etag = await putPart(
          url,
          blob,
          (loaded) => {
            loadedPerPart[partNumber] = loaded;
            reportProgress();
          },
          signal,
        );
        loadedPerPart[partNumber] = blob.size;
        reportProgress();
        return { part_number: partNumber, etag };
      } catch (error) {
        if (signal.aborted || attempt === MAX_PART_ATTEMPTS) throw error;
        loadedPerPart[partNumber] = 0;
        reportProgress();
        await sleep(1000 * 2 ** (attempt - 1)); // ১, ২, ৪ সেকেন্ড অপেক্ষা করে আবার চেষ্টা
      }
    }
    throw new UploadError('Upload failed.');
  };

  // একসাথে ৩টা টুকরো পাঠানো
  const completed: CompletedPart[] = [];
  let next = 1;
  const worker = async () => {
    while (next <= partCount) {
      const partNumber = next++;
      completed.push(await uploadOne(partNumber));
    }
  };
  await Promise.all(Array.from({ length: Math.min(PARALLEL_PARTS, partCount) }, worker));

  completed.sort((a, b) => a.part_number - b.part_number);

  const result = await backend<{ media: MediaFile }>(`media/${media.id}/complete`, {
    method: 'POST',
    body: JSON.stringify({ parts: completed, ...meta }),
    signal,
  });

  onProgress(100);
  return result.media;
}
