'use client';

import React, { useState, useEffect } from 'react';
import {
  useGetAgentConfigQuery,
  useUpdateAgentConfigMutation,
  type FeedSource,
} from '@/redux/api/agent-logs/agentLogsApi';
import {
  Rss,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Loader2,
  Globe,
  Search,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  { key: 'technology', label: 'Technology / Science' },
  { key: 'business', label: 'Business' },
  { key: 'sports', label: 'Sports' },
  { key: 'politics', label: 'Politics' },
  { key: 'world', label: 'World' },
  { key: 'women', label: 'Women' },
  { key: 'tourism', label: 'Tourism / Travel' },
  { key: 'pakistan', label: 'Pakistan' },
  { key: 'china', label: 'China' },
  { key: 'belt-and-road', label: 'Belt & Road / CPEC' },
  { key: 'korea', label: 'South Korea' },
  { key: 'uk', label: 'UK News' },
];

const EMPTY_FEED: FeedSource = {
  category_key: '',
  feed_url: '',
  feed_type: 'rss',
  label: '',
  is_active: true,
};

export default function FeedSourcesManager() {
    // ---
    // ADMIN NOTE: To make RSS feeds global for all categories, add each desired feed for every category in the list below.
    // You can use the UI to add the same feed URL to each category, or script it via the backend if you have many feeds.
    // The backend will merge all feeds for each category, so every category will use all the provided feeds.
    // ---
  const { data: config, isLoading, refetch } = useGetAgentConfigQuery();
  const [updateConfig, { isLoading: isSaving }] = useUpdateAgentConfigMutation();

  const [feeds, setFeeds] = useState<FeedSource[]>([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    if (config?.feed_sources) {
      setFeeds(config.feed_sources);
    }
  }, [config]);

  const addFeed = () => {
    setFeeds((prev) => [...prev, { ...EMPTY_FEED }]);
  };

  const removeFeed = (index: number) => {
    setFeeds((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFeed = (index: number, field: keyof FeedSource, value: string | boolean) => {
    setFeeds((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    );
  };

  const toggleFeed = (index: number) => {
    setFeeds((prev) =>
      prev.map((f, i) => (i === index ? { ...f, is_active: !f.is_active } : f))
    );
  };

  const handleSave = async () => {
    setError('');

    // Validate
    for (const feed of feeds) {
      if (!feed.category_key) {
        setError('All feeds must have a category selected.');
        return;
      }
      if (!feed.feed_url.trim()) {
        setError('All feeds must have a URL or keyword query.');
        return;
      }
      if (feed.feed_type === 'rss') {
        try {
          new URL(feed.feed_url);
        } catch {
          setError(`Invalid RSS URL: ${feed.feed_url}`);
          return;
        }
      }
    }

    try {
      await updateConfig({ feed_sources: feeds }).unwrap();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      refetch();
    } catch (err) {
      console.error('Failed to save feed sources:', err);
      setError('Failed to save. Please try again.');
    }
  };

  const filteredFeeds = filterCategory
    ? feeds.map((f, i) => ({ ...f, _idx: i })).filter((f) => f.category_key === filterCategory)
    : feeds.map((f, i) => ({ ...f, _idx: i }));

  const feedsByCategory = CATEGORY_OPTIONS.map((cat) => ({
    ...cat,
    count: feeds.filter((f) => f.category_key === cat.key).length,
    activeCount: feeds.filter((f) => f.category_key === cat.key && f.is_active !== false).length,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Rss className="h-6 w-6 text-orange-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Feed Sources</h2>
            <p className="text-sm text-gray-500">
              Manage RSS feeds and NewsAPI keywords the agent uses to fetch articles
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" /> Saved
            </span>
          )}
          <button
            onClick={addFeed}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" />
            Add Feed
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save All
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Category overview */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        <button
          onClick={() => setFilterCategory('')}
          className={`rounded-lg border px-3 py-2 text-center text-sm transition-colors ${
            !filterCategory ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          All ({feeds.length})
        </button>
        {feedsByCategory.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilterCategory(cat.key === filterCategory ? '' : cat.key)}
            className={`rounded-lg border px-3 py-2 text-center text-sm transition-colors ${
              filterCategory === cat.key
                ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat.label}
            <span className="ms-1 text-xs text-gray-400">
              {cat.activeCount}/{cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Feed list */}
      {feeds.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <Rss className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-3 text-gray-500">No feed sources configured yet</p>
          <p className="mt-1 text-sm text-gray-400">
            Add RSS feed URLs or NewsAPI keywords for each category
          </p>
          <button
            onClick={addFeed}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add First Feed
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFeeds.map((feed) => {
            const idx = feed._idx;
            return (
              <div
                key={idx}
                className={`rounded-xl border p-4 transition-colors ${
                  feed.is_active !== false
                    ? 'border-gray-200 bg-white'
                    : 'border-gray-100 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex flex-wrap items-start gap-3">
                  {/* Toggle */}
                  <button
                    onClick={() => toggleFeed(idx)}
                    className="mt-1 text-gray-400 hover:text-indigo-600"
                    title={feed.is_active !== false ? 'Disable' : 'Enable'}
                  >
                    {feed.is_active !== false ? (
                      <ToggleRight className="h-6 w-6 text-green-500" />
                    ) : (
                      <ToggleLeft className="h-6 w-6" />
                    )}
                  </button>

                  {/* Category */}
                  <select
                    value={feed.category_key}
                    onChange={(e) => updateFeed(idx, 'category_key', e.target.value)}
                    className="w-44 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select category...</option>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>

                  {/* Type */}
                  <select
                    value={feed.feed_type}
                    onChange={(e) => updateFeed(idx, 'feed_type', e.target.value)}
                    className="w-40 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="rss">RSS Feed</option>
                    <option value="newsapi_keywords">NewsAPI Keywords</option>
                  </select>

                  {/* URL / Keywords */}
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    {feed.feed_type === 'rss' ? (
                      <Globe className="h-4 w-4 shrink-0 text-gray-400" />
                    ) : (
                      <Search className="h-4 w-4 shrink-0 text-gray-400" />
                    )}
                    <input
                      type="text"
                      value={feed.feed_url}
                      onChange={(e) => updateFeed(idx, 'feed_url', e.target.value)}
                      placeholder={
                        feed.feed_type === 'rss'
                          ? 'https://example.com/feed/rss.xml'
                          : 'keyword1 OR keyword2 AND keyword3'
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Label */}
                  <input
                    type="text"
                    value={feed.label || ''}
                    onChange={(e) => updateFeed(idx, 'label', e.target.value)}
                    placeholder="Label (optional)"
                    className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />

                  {/* Delete */}
                  <button
                    onClick={() => removeFeed(idx)}
                    className="mt-1 text-gray-400 hover:text-red-500"
                    title="Remove feed"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick-add section */}
      {feeds.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={addFeed}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600"
          >
            <Plus className="h-4 w-4" />
            Add another feed source
          </button>
        </div>
      )}
    </div>
  );
}
