'use client';

import React, { useState } from 'react';
import {
  useGetSocialPostsQuery,
  useGetSocialStatsQuery,
  type SocialMediaPostItem,
} from '@/redux/api/agent-logs/agentLogsApi';
import {
  Share2,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const platformColors: Record<string, string> = {
  twitter: 'bg-sky-100 text-sky-700',
  linkedin: 'bg-blue-100 text-blue-700',
  facebook: 'bg-indigo-100 text-indigo-700',
};

const statusColors: Record<string, string> = {
  posted: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
  skipped: 'bg-gray-100 text-gray-500',
};

const platformLabels: Record<string, string> = {
  twitter: 'Twitter/X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString();
}

function truncate(str: string, maxLen: number): string {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

export default function SocialDashboard() {
  const [page, setPage] = useState(1);
  const [filterPlatform, setFilterPlatform] = useState('');
  const { data: stats, isLoading: statsLoading } = useGetSocialStatsQuery();
  const { data: posts, isLoading: postsLoading } = useGetSocialPostsQuery({
    page,
    limit: 20,
    platform: filterPlatform || undefined,
  });

  const isLoading = statsLoading || postsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Build platform summary from stats
  const platformSummary: Record<string, { posted: number; failed: number; total: number }> = {};
  for (const row of stats?.byPlatform || []) {
    if (!platformSummary[row.platform]) {
      platformSummary[row.platform] = { posted: 0, failed: 0, total: 0 };
    }
    const count = parseInt(row.count, 10);
    platformSummary[row.platform].total += count;
    if (row.status === 'posted') platformSummary[row.platform].posted += count;
    if (row.status === 'failed') platformSummary[row.platform].failed += count;
  }

  const items = posts?.items || [];
  const total = posts?.total || 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Share2 className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-900">Social Media Distribution</h2>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {['twitter', 'linkedin', 'facebook'].map((platform) => {
          const data = platformSummary[platform] || { posted: 0, failed: 0, total: 0 };
          return (
            <div key={platform} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${platformColors[platform]}`}>
                  {platformLabels[platform]}
                </span>
                <span className="text-lg font-bold text-gray-900">{data.total}</span>
              </div>
              <div className="mt-3 flex gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {data.posted}
                </span>
                <span className="flex items-center gap-1 text-red-500">
                  <XCircle className="h-3.5 w-3.5" /> {data.failed}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-1 rounded-lg border bg-gray-50 p-0.5">
        <button
          onClick={() => { setFilterPlatform(''); setPage(1); }}
          className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
            !filterPlatform ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All
        </button>
        {['twitter', 'linkedin', 'facebook'].map((p) => (
          <button
            key={p}
            onClick={() => { setFilterPlatform(p); setPage(1); }}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              filterPlatform === p ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {platformLabels[p]}
          </button>
        ))}
      </div>

      {/* Posts Table */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-12">
          <Share2 className="mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-500">No social media posts yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Article</th>
                <th className="px-4 py-3">Platform</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Posted</th>
                <th className="px-4 py-3">Error</th>
                <th className="px-4 py-3 text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((post: SocialMediaPostItem) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {truncate(post.source_title || '—', 50)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${platformColors[post.platform]}`}>
                      {platformLabels[post.platform]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[post.status]}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(post.posted_at)}</td>
                  <td className="px-4 py-3 text-xs text-red-500">
                    {post.error_message ? truncate(post.error_message, 40) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {post.post_url && (
                      <a
                        href={post.post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
    </div>
  );
}
