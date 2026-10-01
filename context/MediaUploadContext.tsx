'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { UploadError, uploadVideo, type MediaFile } from '../lib/media-upload';

export type UploadStatus = 'idle' | 'uploading' | 'ready' | 'error';

interface MediaUploadValue {
  status: UploadStatus;
  progress: number;
  media: MediaFile | null;
  error: string | null;
  fileName: string | null;
  startUpload: (file: File) => Promise<void>;
  cancelUpload: () => void;
  resetUpload: () => void;
}

const MediaUploadContext = createContext<MediaUploadValue | undefined>(undefined);

export function MediaUploadProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [media, setMedia] = useState<MediaFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const cancelUpload = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  }, []);

  const resetUpload = useCallback(() => {
    cancelUpload();
    setStatus('idle');
    setProgress(0);
    setMedia(null);
    setError(null);
    setFileName(null);
  }, [cancelUpload]);

  const startUpload = useCallback(
    async (file: File) => {
      cancelUpload(); // আগের আপলোড চলতে থাকলে বাতিল
      const controller = new AbortController();
      controllerRef.current = controller;

      setStatus('uploading');
      setProgress(0);
      setMedia(null);
      setError(null);
      setFileName(file.name);

      try {
        const uploaded = await uploadVideo(file, setProgress, controller.signal);
        if (controller.signal.aborted) return;
        setMedia(uploaded);
        setStatus('ready');
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof UploadError ? err.message : 'Upload failed. Please try again.');
        setStatus('error');
      }
    },
    [cancelUpload],
  );

  const value = useMemo(
    () => ({ status, progress, media, error, fileName, startUpload, cancelUpload, resetUpload }),
    [status, progress, media, error, fileName, startUpload, cancelUpload, resetUpload],
  );

  return <MediaUploadContext.Provider value={value}>{children}</MediaUploadContext.Provider>;
}

export function useMediaUpload(): MediaUploadValue {
  const context = useContext(MediaUploadContext);
  if (!context) {
    throw new Error('useMediaUpload must be used inside <MediaUploadProvider>');
  }
  return context;
}
