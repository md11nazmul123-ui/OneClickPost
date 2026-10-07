/**
 * পোস্ট পাবলিশ — Next.js BFF (/api/backend/*) দিয়ে Laravel-এ।
 * ভিডিও ব্রাউজার থেকে আবার যায় না; সার্ভারে আগে আপলোড হওয়া ফাইলটাই YouTube-এ পাঠানো হয়।
 */

export type ServerTargetStatus =
  | 'pending'
  | 'queued'
  | 'uploading'
  | 'processing'
  | 'published'
  | 'failed'
  | 'cancelled';

export interface ServerPostTarget {
  id: string;
  social_account_id: string | null;
  platform: string;
  status: ServerTargetStatus;
  progress: number;
  url: string | null;
  error: string | null;
  published_at: string | null;
}

export interface ServerPost {
  id: string;
  title: string | null;
  description: string | null;
  tags: string[];
  status: string;
  created_at: string | null;
  published_at: string | null;
  targets: ServerPostTarget[];
}

export interface PublishInput {
  media_id: string;
  title: string;
  description: string;
  tags: string[];
  privacy: 'private' | 'unlisted' | 'public';
  made_for_kids: boolean;
  account_ids: string[];
}

export class PostApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

interface ApiBody<T> {
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
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
    throw new PostApiError('Network error. Please check your connection.', 0);
  }

  const body = (await response.json().catch(() => ({}))) as ApiBody<T>;
  if (!response.ok || body.data === undefined) {
    const firstFieldError = body.errors ? Object.values(body.errors)[0]?.[0] : undefined;
    throw new PostApiError(firstFieldError ?? body.message ?? 'Something went wrong.', response.status);
  }
  return body.data;
}

export const FINAL_TARGET_STATUSES: ServerTargetStatus[] = ['published', 'failed', 'cancelled'];

export const postsApi = {
  publish: async (input: PublishInput) =>
    (await backend<{ post: ServerPost }>('posts', { method: 'POST', body: JSON.stringify(input) })).post,

  get: async (id: string) => (await backend<{ post: ServerPost }>(`posts/${encodeURIComponent(id)}`)).post,
};

/** YouTube-এর নিয়মে title/description থেকে < > সরানো, সীমার মধ্যে রাখা */
export function sanitizeForYouTube(text: string, max: number): string {
  return text.replace(/[<>]/g, '').trim().slice(0, max);
}

/** "#tag1 #tag2" বা ["#a","b"] → ["tag1","tag2"] */
export function normalizeTags(tags: string[]): string[] {
  const out: string[] = [];
  for (const raw of tags) {
    const tag = raw.replace(/[#<>,]/g, '').trim();
    if (tag && !out.includes(tag) && out.length < 30) out.push(tag.slice(0, 100));
  }
  return out;
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
