'use client';

import { useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface UploadProgress {
  /** 0-100 */
  percent: number;
  /** Bytes uploaded so far */
  loaded: number;
  /** Total bytes (0 if unknown) */
  total: number;
  /** Upload speed in bytes/sec */
  speed: number;
}

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UseUploadWithProgressReturn<T = unknown> {
  upload: (endpoint: string, formData: FormData, method?: string) => Promise<T>;
  progress: UploadProgress;
  status: UploadStatus;
  error: string | null;
  reset: () => void;
  abort: () => void;
}

const INITIAL_PROGRESS: UploadProgress = {
  percent: 0,
  loaded: 0,
  total: 0,
  speed: 0,
};

export function useUploadWithProgress<T = unknown>(): UseUploadWithProgressReturn<T> {
  const [progress, setProgress] = useState<UploadProgress>(INITIAL_PROGRESS);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const startTimeRef = useRef<number>(0);

  const token = useSelector((state: RootState) => (state.auth as any)?.accessToken);

  const reset = useCallback(() => {
    setProgress(INITIAL_PROGRESS);
    setStatus('idle');
    setError(null);
  }, []);

  const abort = useCallback(() => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setStatus('idle');
    setProgress(INITIAL_PROGRESS);
  }, []);

  const upload = useCallback(
    (endpoint: string, formData: FormData, method = 'POST'): Promise<T> => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        startTimeRef.current = Date.now();

        setStatus('uploading');
        setError(null);
        setProgress(INITIAL_PROGRESS);

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const elapsed = (Date.now() - startTimeRef.current) / 1000;
            const speed = elapsed > 0 ? event.loaded / elapsed : 0;
            setProgress({
              percent: Math.round((event.loaded / event.total) * 100),
              loaded: event.loaded,
              total: event.total,
              speed,
            });
          }
        });

        xhr.addEventListener('load', () => {
          xhrRef.current = null;
          if (xhr.status >= 200 && xhr.status < 300) {
            setStatus('success');
            setProgress((p) => ({ ...p, percent: 100 }));
            try {
              resolve(JSON.parse(xhr.responseText) as T);
            } catch {
              resolve(xhr.responseText as unknown as T);
            }
          } else {
            let message = `Upload failed (${xhr.status})`;
            try {
              const body = JSON.parse(xhr.responseText);
              message = body?.message || message;
            } catch { /* ignore */ }
            setStatus('error');
            setError(message);
            reject(new Error(message));
          }
        });

        xhr.addEventListener('error', () => {
          xhrRef.current = null;
          setStatus('error');
          const msg = 'Network error during upload';
          setError(msg);
          reject(new Error(msg));
        });

        xhr.addEventListener('abort', () => {
          xhrRef.current = null;
          setStatus('idle');
          reject(new Error('Upload aborted'));
        });

        xhr.open(method, `${API_URL}${endpoint}`);
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        // Don't set Content-Type — browser sets it with FormData boundary
        xhr.withCredentials = true;
        xhr.send(formData);
      });
    },
    [token],
  );

  return { upload, progress, status, error, reset, abort };
}
