'use client';

import React, { useState, useEffect } from 'react';
import {
  useGetAgentConfigQuery,
  useUpdateAgentConfigMutation,
  type AgentConfig,
} from '@/redux/api/agent-logs/agentLogsApi';
import {
  Settings,
  Save,
  Power,
  Clock,
  Image,
  FileText,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

const IMAGE_STRATEGIES = [
  { value: 'source_attribution', label: 'Source Attribution (use original image + credit overlay)' },
  { value: 'ai_generate', label: 'AI Generate (create new image via AI)' },
  { value: 'ai_with_fallback', label: 'AI with Fallback (try AI, fallback to source)' },
];

const IMAGE_PROVIDERS = [
  { value: 'pollinations', label: 'Pollinations.ai (free)' },
  { value: 'huggingface', label: 'HuggingFace (free tier)' },
  { value: 'gemini', label: 'Gemini (requires billing)' },
];

const AVAILABLE_CATEGORIES = [
  { key: 'technology', label: 'Technology' },
  { key: 'business', label: 'Business' },
  { key: 'sports', label: 'Sports' },
  { key: 'politics', label: 'Politics' },
  { key: 'world', label: 'World' },
  { key: 'women', label: 'Women' },
  { key: 'tourism', label: 'Tourism' },
  { key: 'pakistan', label: 'Pakistan' },
  { key: 'china', label: 'China' },
  { key: 'belt-and-road', label: 'Belt & Road / CPEC' },
  { key: 'korea', label: 'South Korea' },
  { key: 'uk', label: 'UK News' },
];

export default function AgentSettings() {
  const { data: config, isLoading, refetch } = useGetAgentConfigQuery();
  const [updateConfig, { isLoading: isSaving }] = useUpdateAgentConfigMutation();

  const [form, setForm] = useState<Partial<AgentConfig>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (config) {
      setForm({
        enabled: config.enabled,
        max_posts_per_session: config.max_posts_per_session,
        pipeline_interval_minutes: config.pipeline_interval_minutes,
        stagger_delay_seconds: config.stagger_delay_seconds,
        max_article_age_hours: config.max_article_age_hours,
        max_articles_per_category: config.max_articles_per_category,
        require_featured_image: config.require_featured_image,
        image_strategy: config.image_strategy,
        image_ai_provider: config.image_ai_provider,
        auto_publish: config.auto_publish,
        categories_enabled: config.categories_enabled || [],
        categories_requiring_review: config.categories_requiring_review || [],
      });
    }
  }, [config]);

  const handleSave = async () => {
    try {
      await updateConfig(form).unwrap();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      refetch();
    } catch (err) {
      console.error('Failed to save config:', err);
    }
  };

  const updateField = <K extends keyof AgentConfig>(key: K, value: AgentConfig[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCategory = (key: string) => {
    const current = form.categories_enabled || [];
    if (current.includes(key)) {
      updateField('categories_enabled', current.filter((c) => c !== key));
    } else {
      updateField('categories_enabled', [...current, key]);
    }
  };

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
          <Settings className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Agent Configuration</h2>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" /> Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {config?.updated_at && (
        <p className="text-xs text-gray-500">
          Last updated: {new Date(config.updated_at).toLocaleString()}
        </p>
      )}

      {/* Master Switch */}
      <div className={`rounded-xl border-2 p-5 ${form.enabled ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Power className={`h-6 w-6 ${form.enabled ? 'text-green-600' : 'text-red-600'}`} />
            <div>
              <h3 className="font-semibold text-gray-900">Agent Status</h3>
              <p className="text-sm text-gray-600">
                {form.enabled ? 'Agent is active and will run on schedule' : 'Agent is paused — no new runs will start'}
              </p>
            </div>
          </div>
          <button
            onClick={() => updateField('enabled', !form.enabled)}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${form.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${form.enabled ? 'translate-x-8' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Scheduling */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Scheduling</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Pipeline Interval (minutes)
              </label>
              <input
                type="number"
                min={5}
                max={1440}
                value={form.pipeline_interval_minutes || 90}
                onChange={(e) => updateField('pipeline_interval_minutes', parseInt(e.target.value) || 90)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">How often the agent runs (5–1440 min)</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Stagger Delay Between Posts (seconds)
              </label>
              <input
                type="number"
                min={0}
                max={7200}
                value={form.stagger_delay_seconds || 1800}
                onChange={(e) => updateField('stagger_delay_seconds', parseInt(e.target.value) || 1800)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">Delay between publishing articles for natural cadence</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Max Article Age (hours)
              </label>
              <input
                type="number"
                min={1}
                max={168}
                value={form.max_article_age_hours || 24}
                onChange={(e) => updateField('max_article_age_hours', parseInt(e.target.value) || 24)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">Skip articles older than this</p>
            </div>
          </div>
        </div>

        {/* Post Limits */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Post Limits</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Max Posts Per Session
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={form.max_posts_per_session || 25}
                onChange={(e) => updateField('max_posts_per_session', parseInt(e.target.value) || 25)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">Maximum articles published per pipeline run</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Max Articles Per Category
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={form.max_articles_per_category || 5}
                onChange={(e) => updateField('max_articles_per_category', parseInt(e.target.value) || 5)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">How many new articles to fetch per category</p>
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Auto Publish</p>
                <p className="text-xs text-gray-500">Publish immediately or save as draft</p>
              </div>
              <button
                onClick={() => updateField('auto_publish', !form.auto_publish)}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${form.auto_publish ? 'bg-indigo-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.auto_publish ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Image Settings */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Image className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Image Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border bg-amber-50 p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Require Featured Image</p>
                  <p className="text-xs text-gray-500">Skip articles without a proper attributed image</p>
                </div>
              </div>
              <button
                onClick={() => updateField('require_featured_image', !form.require_featured_image)}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${form.require_featured_image ? 'bg-amber-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.require_featured_image ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Image Strategy
              </label>
              <select
                value={form.image_strategy || 'source_attribution'}
                onChange={(e) => updateField('image_strategy', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {IMAGE_STRATEGIES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                AI Image Provider
              </label>
              <select
                value={form.image_ai_provider || 'pollinations'}
                onChange={(e) => updateField('image_ai_provider', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {IMAGE_PROVIDERS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Only used when strategy includes AI generation</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-teal-600" />
            <h3 className="font-semibold text-gray-900">Categories</h3>
            <span className="text-xs text-gray-500">
              ({(form.categories_enabled || []).length === 0 ? 'All enabled' : `${(form.categories_enabled || []).length} selected`})
            </span>
          </div>
          <p className="mb-3 text-xs text-gray-500">
            Leave empty to process all categories. Select specific ones to limit.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_CATEGORIES.map((cat) => {
              const isSelected = (form.categories_enabled || []).includes(cat.key);
              return (
                <button
                  key={cat.key}
                  onClick={() => toggleCategory(cat.key)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    isSelected
                      ? 'border-teal-300 bg-teal-50 font-medium text-teal-700'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Requiring Review (HITL) */}
        <div className="rounded-xl border bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-gray-900">Human Review Required</h3>
            <span className="text-xs text-gray-500">
              ({(form.categories_requiring_review || []).length === 0 ? 'None' : `${(form.categories_requiring_review || []).length} selected`})
            </span>
          </div>
          <p className="mb-3 text-xs text-gray-500">
            Articles in these categories will be saved as drafts and require manual approval before publishing.
          </p>
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-4">
            {AVAILABLE_CATEGORIES.map((cat) => {
              const isSelected = (form.categories_requiring_review || []).includes(cat.key);
              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    const current = form.categories_requiring_review || [];
                    if (current.includes(cat.key)) {
                      updateField('categories_requiring_review', current.filter((c) => c !== cat.key));
                    } else {
                      updateField('categories_requiring_review', [...current, cat.key]);
                    }
                  }}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    isSelected
                      ? 'border-amber-300 bg-amber-50 font-medium text-amber-700'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
