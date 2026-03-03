'use client';

import type { UploadProgress, UploadStatus } from '@/lib/useUploadWithProgress';
import { X } from 'lucide-react';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function formatSpeed(bytesPerSec: number): string {
  return `${formatBytes(bytesPerSec)}/s`;
}

function estimateRemaining(progress: UploadProgress): string {
  if (progress.speed <= 0 || progress.total <= 0) return '';
  const remaining = (progress.total - progress.loaded) / progress.speed;
  if (remaining < 60) return `${Math.ceil(remaining)}s remaining`;
  return `${Math.ceil(remaining / 60)}m remaining`;
}

interface UploadProgressBarProps {
  progress: UploadProgress;
  status: UploadStatus;
  error: string | null;
  onAbort?: () => void;
  className?: string;
}

export default function UploadProgressBar({
  progress,
  status,
  error,
  onAbort,
  className = '',
}: UploadProgressBarProps) {
  if (status === 'idle') return null;

  const isUploading = status === 'uploading';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <div className={`rounded-lg border p-4 ${
      isError
        ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
        : isSuccess
          ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
          : 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
    } ${className}`}>
      {/* Header row */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">
          {isUploading && 'Uploading...'}
          {isSuccess && 'Upload complete!'}
          {isError && 'Upload failed'}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tabular-nums">
            {progress.percent}%
          </span>
          {isUploading && onAbort && (
            <button
              type="button"
              onClick={onAbort}
              className="rounded p-0.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Cancel upload"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            isError
              ? 'bg-red-500'
              : isSuccess
                ? 'bg-green-500'
                : 'bg-blue-600'
          }`}
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      {/* Details row */}
      <div className="mt-1.5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>
          {progress.total > 0
            ? `${formatBytes(progress.loaded)} / ${formatBytes(progress.total)}`
            : formatBytes(progress.loaded)}
        </span>
        {isUploading && (
          <span className="flex gap-2">
            {progress.speed > 0 && <span>{formatSpeed(progress.speed)}</span>}
            {estimateRemaining(progress) && (
              <span className="text-gray-400">{estimateRemaining(progress)}</span>
            )}
          </span>
        )}
        {isSuccess && <span className="text-green-600 dark:text-green-400">Processing...</span>}
        {isError && error && (
          <span className="text-red-600 dark:text-red-400">{error}</span>
        )}
      </div>
    </div>
  );
}
