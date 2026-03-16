'use client';

import React, { useState } from 'react';
import {
  useGetReviewQueueQuery,
  useApproveArticleMutation,
  useRejectArticleMutation,
  type ReviewQueueArticle,
} from '@/redux/api/agent-logs/agentLogsApi';
import {
  CheckCircle2,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
  FileText,
  AlertTriangle,
  X,
} from 'lucide-react';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString();
}

function truncate(str: string, maxLen: number): string {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

// ── Article Preview Modal ─────────────────────────────────────

function PreviewModal({
  article,
  onClose,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: {
  article: ReviewQueueArticle;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const seo = article.seo_metadata as Record<string, string> | null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {seo?.title || article.source_title}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Meta */}
        <div className="border-b bg-gray-50 px-6 py-3">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>Category: <strong>{article.category_slug}</strong></span>
            <span>Source: <strong>{article.source_name || '—'}</strong></span>
            {seo?.slug && <span>Slug: <code className="rounded bg-gray-200 px-1 text-xs">{seo.slug}</code></span>}
            {seo?.primary_keyword && <span>Keyword: <strong>{seo.primary_keyword as string}</strong></span>}
          </div>
          {seo?.excerpt && (
            <p className="mt-2 text-sm italic text-gray-500">{seo.excerpt as string}</p>
          )}
        </div>

        {/* Image */}
        {article.generated_image_url && (
          <div className="border-b px-6 py-4">
            <img
              src={article.generated_image_url}
              alt="Featured"
              className="h-48 w-full rounded-lg object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4">
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: article.rewritten_content || '<em>No rewritten content available</em>',
            }}
          />
        </div>

        {/* Source Link */}
        <div className="border-t px-6 py-3">
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            View original source <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 flex items-center justify-between border-t bg-gray-50 px-6 py-4">
          {showRejectInput ? (
            <div className="flex flex-1 items-center gap-2">
              <input
                type="text"
                placeholder="Rejection reason (optional)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              />
              <button
                onClick={() => onReject(rejectReason)}
                disabled={isRejecting}
                className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                Confirm Reject
              </button>
              <button
                onClick={() => setShowRejectInput(false)}
                className="rounded-lg border px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowRejectInput(true)}
                className="inline-flex items-center gap-1 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4" /> Reject
              </button>
              <button
                onClick={onApprove}
                disabled={isApproving}
                className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Approve & Publish
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Review Queue ─────────────────────────────────────────

export default function ReviewQueue() {
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<ReviewQueueArticle | null>(null);
  const { data, isLoading, refetch } = useGetReviewQueueQuery({ page, limit: 20 });
  const [approveArticle, { isLoading: isApproving }] = useApproveArticleMutation();
  const [rejectArticle, { isLoading: isRejecting }] = useRejectArticleMutation();

  const handleApprove = async (id: string) => {
    await approveArticle(id).unwrap();
    setPreview(null);
    refetch();
  };

  const handleReject = async (id: string, reason: string) => {
    await rejectArticle({ id, reason }).unwrap();
    setPreview(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const items = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16">
        <CheckCircle2 className="mb-3 h-12 w-12 text-green-300" />
        <h3 className="text-lg font-medium text-gray-700">Review Queue Empty</h3>
        <p className="mt-1 text-sm text-gray-500">
          All articles have been reviewed. Nice job!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-gray-900">Review Queue</h2>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            {total} pending
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((article) => {
              const seo = article.seo_metadata as Record<string, string> | null;
              return (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">
                      {truncate(seo?.title || article.source_title, 60)}
                    </p>
                    {seo?.slug && (
                      <p className="text-xs text-gray-400">/{seo.slug}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {article.category_slug}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {article.source_name || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      <AlertTriangle className="h-3 w-3" />
                      {article.post_status || article.article_status || 'pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(article.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setPreview(article)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleApprove(article.id)}
                        disabled={isApproving}
                        className="rounded-lg p-1.5 text-green-500 hover:bg-green-50 hover:text-green-700"
                        title="Approve"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleReject(article.id, '')}
                        disabled={isRejecting}
                        className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-700"
                        title="Reject"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages} ({total} items)
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <PreviewModal
          article={preview}
          onClose={() => setPreview(null)}
          onApprove={() => handleApprove(preview.id)}
          onReject={(reason) => handleReject(preview.id, reason)}
          isApproving={isApproving}
          isRejecting={isRejecting}
        />
      )}
    </div>
  );
}
