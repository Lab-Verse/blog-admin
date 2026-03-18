'use client';

import React, { useState } from 'react';
import {
  useGetAgentRunsQuery,
  useGetAgentRunQuery,
  type AgentRun,
  type SEORunReport,
  type SEOArticleReport,
} from '@/redux/api/agent-logs/agentLogsApi';
import {
  Link2,
  ExternalLink,
  Search,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Globe,
  BarChart3,
  BookOpen,
} from 'lucide-react';

// ─── Article Detail Accordion ────────────────────────────────────

function ArticleReportCard({ article }: { article: SEOArticleReport }) {
  const [expanded, setExpanded] = useState(false);

  const densityColor =
    article.keyword_density_pct >= 1.5 && article.keyword_density_pct <= 2.5
      ? 'text-green-600'
      : article.keyword_density_pct > 2.5
        ? 'text-amber-600'
        : 'text-red-500';

  const catIcon =
    article.category_status === 'success' ? (
      <CheckCircle2 className="h-4 w-4 text-green-500" />
    ) : article.category_status === 'fallback' ? (
      <AlertTriangle className="h-4 w-4 text-amber-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );

  return (
    <div className="rounded-lg border bg-white">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50"
      >
        <div className="flex items-center gap-3 min-w-0">
          {catIcon}
          <span className="truncate text-sm font-medium text-gray-900">
            {article.article_id.slice(0, 8)}…
          </span>
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
            {article.primary_keyword || 'N/A'}
          </span>
          <span className={`text-xs font-semibold ${densityColor}`}>
            {article.keyword_density_pct}%
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Link2 className="h-3 w-3" />
            {article.internal_links.length}
            <ExternalLink className="h-3 w-3 ml-1" />
            {article.external_links.length}
          </span>
        </div>
        {expanded ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
      </button>

      {expanded && (
        <div className="border-t px-4 py-3 space-y-3 text-sm">
          {/* Metrics row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <span className="text-xs text-gray-500">Words</span>
              <p className="font-semibold">{article.word_count}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Keyword Density</span>
              <p className={`font-semibold ${densityColor}`}>{article.keyword_density_pct}%</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Readability</span>
              <p className="font-semibold">{article.readability_grade}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Category</span>
              <p className="font-semibold">
                {article.category_target}
                {article.category_fallback && (
                  <span className="ml-1 text-amber-600 text-xs">→ fallback from {article.category_fallback}</span>
                )}
              </p>
            </div>
          </div>

          {/* Internal Links */}
          {article.internal_links.length > 0 && (
            <div>
              <h4 className="flex items-center gap-1 text-xs font-semibold text-gray-700 uppercase mb-1">
                <Link2 className="h-3 w-3" /> Internal Links
              </h4>
              <ul className="space-y-1">
                {article.internal_links.map((link, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs">
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 font-medium text-blue-700">{link.anchor}</span>
                    <span className="text-gray-400">→</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-blue-600 hover:underline"
                    >
                      {link.name.slice(0, 60)}{link.name.length > 60 ? '…' : ''}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* External Links */}
          {article.external_links.length > 0 && (
            <div>
              <h4 className="flex items-center gap-1 text-xs font-semibold text-gray-700 uppercase mb-1">
                <ExternalLink className="h-3 w-3" /> External Authority Links
              </h4>
              <ul className="space-y-1">
                {article.external_links.map((link, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs">
                    <span className="rounded bg-purple-50 px-1.5 py-0.5 font-medium text-purple-700">{link.anchor}</span>
                    <span className="text-gray-400">→</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-purple-600 hover:underline"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Source URLs */}
          {article.source_urls.length > 0 && (
            <div>
              <h4 className="flex items-center gap-1 text-xs font-semibold text-gray-700 uppercase mb-1">
                <Globe className="h-3 w-3" /> Sources
              </h4>
              <ul className="space-y-0.5">
                {article.source_urls.filter(Boolean).map((url, i) => (
                  <li key={i}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:underline truncate block">
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Run Report View ─────────────────────────────────────────────

function RunSEOReport({ run }: { run: AgentRun }) {
  const { data: detailedRun } = useGetAgentRunQuery(run.id);
  const seoReport = detailedRun?.cost_summary?.seo_report;

  if (!seoReport) {
    return (
      <div className="rounded-lg border bg-gray-50 p-6 text-center text-sm text-gray-500">
        No SEO report available for this run.
        {!detailedRun?.cost_summary && ' (Run may predate SEO engine integration.)'}
      </div>
    );
  }

  const { seo_summary, articles, source_urls, errors } = seoReport;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <SummaryCard
          icon={<Link2 className="h-5 w-5 text-blue-500" />}
          label="Internal Links"
          value={seo_summary.total_internal_links_added}
        />
        <SummaryCard
          icon={<ExternalLink className="h-5 w-5 text-purple-500" />}
          label="External Links"
          value={seo_summary.total_external_links_added}
        />
        <SummaryCard
          icon={<Search className="h-5 w-5 text-green-500" />}
          label="Avg Density"
          value={`${seo_summary.avg_keyword_density_pct}%`}
        />
        <SummaryCard
          icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
          label="Categories OK"
          value={seo_summary.category_routing.successes}
        />
        <SummaryCard
          icon={<XCircle className="h-5 w-5 text-red-500" />}
          label="Cat. Failures"
          value={seo_summary.category_routing.failures}
        />
        <SummaryCard
          icon={<Globe className="h-5 w-5 text-indigo-500" />}
          label="Sources"
          value={source_urls.length}
        />
      </div>

      {/* Source URLs */}
      {source_urls.length > 0 && (
        <div className="rounded-lg border bg-white p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
            <Globe className="h-4 w-4" />
            Data Sources ({source_urls.length})
          </h3>
          <div className="max-h-32 overflow-y-auto space-y-0.5">
            {source_urls.filter(Boolean).map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-blue-600 hover:underline truncate"
              >
                {url}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Per-Article Reports */}
      {articles.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
            <FileText className="h-4 w-4" />
            Article SEO Details ({articles.length})
          </h3>
          <div className="space-y-2">
            {articles.map((article, i) => (
              <ArticleReportCard key={i} article={article} />
            ))}
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-red-800 mb-2">
            <AlertTriangle className="h-4 w-4" />
            SEO Errors ({errors.length})
          </h3>
          <ul className="space-y-1">
            {errors.map((err, i) => (
              <li key={i} className="text-xs text-red-700">{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-white p-3">
      {icon}
      <div>
        <p className="text-lg font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

// ─── Main SEO Dashboard Component ────────────────────────────────

export default function SEOReportDashboard() {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const { data: runsData, isLoading } = useGetAgentRunsQuery({ page: 1, limit: 10 });

  const runs = runsData?.items || [];
  const completedRuns = runs.filter((r) => r.status === 'completed');

  // Auto-select latest completed run
  const activeRunId = selectedRunId || completedRuns[0]?.id;
  const selectedRun = runs.find((r) => r.id === activeRunId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <BarChart3 className="h-5 w-5 text-indigo-500" />
          SEO Execution Reports
        </h2>
      </div>

      {/* Run Selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Select Run:</label>
        <select
          value={activeRunId || ''}
          onChange={(e) => setSelectedRunId(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {completedRuns.length === 0 && <option value="">No completed runs</option>}
          {completedRuns.map((run) => (
            <option key={run.id} value={run.id}>
              {new Date(run.started_at).toLocaleString()} — {run.articles_published} published, {run.articles_failed} failed
            </option>
          ))}
        </select>
      </div>

      {/* Report */}
      {selectedRun ? (
        <RunSEOReport run={selectedRun} />
      ) : (
        <div className="rounded-lg border bg-gray-50 p-8 text-center text-sm text-gray-500">
          <BookOpen className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          No completed runs to display. SEO reports will appear here after the agent completes a pipeline run.
        </div>
      )}
    </div>
  );
}
