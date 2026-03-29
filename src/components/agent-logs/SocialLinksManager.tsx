'use client';

import React, { useState, useEffect } from 'react';
import {
  useGetAgentConfigQuery,
  useUpdateAgentConfigMutation,
  type SocialLink,
  type PlatformConfig,
} from '@/redux/api/agent-logs/agentLogsApi';
import {
  Link2,
  Plus,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  Globe,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

const DEFAULT_PLATFORMS = [
  { platform: 'twitter', label: 'Twitter / X' },
  { platform: 'facebook', label: 'Facebook' },
  { platform: 'linkedin', label: 'LinkedIn' },
  { platform: 'instagram', label: 'Instagram' },
  { platform: 'youtube', label: 'YouTube' },
  { platform: 'tiktok', label: 'TikTok' },
  { platform: 'whatsapp', label: 'WhatsApp Channel' },
  { platform: 'telegram', label: 'Telegram' },
  { platform: 'pinterest', label: 'Pinterest' },
  { platform: 'threads', label: 'Threads' },
];

export default function SocialLinksManager() {
  const { data: config, isLoading } = useGetAgentConfigQuery();
  const [updateConfig, { isLoading: isSaving }] = useUpdateAgentConfigMutation();

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig[]>([]);
  const [saved, setSaved] = useState(false);
  const [newPlatformName, setNewPlatformName] = useState('');
  const [newPlatformLabel, setNewPlatformLabel] = useState('');

  useEffect(() => {
    if (config) {
      setSocialLinks(Array.isArray(config.social_links) ? config.social_links : []);
      setPlatformConfig(Array.isArray(config.platform_config) ? config.platform_config : []);
    }
  }, [config]);

  const handleSave = async () => {
    try {
      await updateConfig({ social_links: socialLinks, platform_config: platformConfig }).unwrap();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save social links:', err);
    }
  };

  const addSocialLink = (platform: string, label: string) => {
    if (socialLinks.some((l) => l.platform === platform)) return;
    setSocialLinks([...socialLinks, { platform, label, url: '', enabled: true }]);
  };

  const addCustomPlatform = () => {
    const key = newPlatformName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (!key || !newPlatformLabel) return;
    if (socialLinks.some((l) => l.platform === key)) return;
    setSocialLinks([...socialLinks, { platform: key, label: newPlatformLabel, url: '', enabled: true }]);
    setNewPlatformName('');
    setNewPlatformLabel('');
  };

  const removeSocialLink = (platform: string) => {
    setSocialLinks(socialLinks.filter((l) => l.platform !== platform));
  };

  const updateLinkUrl = (platform: string, url: string) => {
    setSocialLinks(socialLinks.map((l) => (l.platform === platform ? { ...l, url } : l)));
  };

  const toggleLinkEnabled = (platform: string) => {
    setSocialLinks(socialLinks.map((l) => (l.platform === platform ? { ...l, enabled: !l.enabled } : l)));
  };

  const toggleAutoPost = (platform: string) => {
    const existing = platformConfig.find((p) => p.platform === platform);
    if (existing) {
      setPlatformConfig(platformConfig.map((p) =>
        p.platform === platform ? { ...p, auto_post: !p.auto_post } : p,
      ));
    } else {
      const link = socialLinks.find((l) => l.platform === platform);
      setPlatformConfig([...platformConfig, {
        platform,
        label: link?.label || platform,
        enabled: true,
        auto_post: true,
      }]);
    }
  };

  const isAutoPost = (platform: string) => {
    return platformConfig.find((p) => p.platform === platform)?.auto_post ?? false;
  };

  // Platforms available to add (not yet in socialLinks)
  const availablePlatforms = DEFAULT_PLATFORMS.filter(
    (p) => !socialLinks.some((l) => l.platform === p.platform),
  );

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
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Social Links Management</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500">
        Manage your social media profile links. These are displayed on the site and used by the agent
        for social media distribution. Enable &quot;Auto-Post&quot; for platforms where the agent should
        automatically share published articles.
      </p>

      {/* Current Social Links */}
      <div className="space-y-3">
        {socialLinks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-12">
            <Globe className="mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">No social links configured</p>
            <p className="mt-1 text-xs text-gray-400">Add platforms below to get started</p>
          </div>
        ) : (
          socialLinks.map((link) => (
            <div
              key={link.platform}
              className={`rounded-xl border bg-white p-4 shadow-sm transition-opacity ${
                !link.enabled ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Platform label */}
                <div className="w-36 shrink-0">
                  <span className="text-sm font-semibold text-gray-700">{link.label}</span>
                  <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-mono text-gray-500">
                    {link.platform}
                  </span>
                </div>

                {/* URL input */}
                <div className="flex-1">
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLinkUrl(link.platform, e.target.value)}
                    placeholder={`https://${link.platform}.com/yourprofile`}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Auto-post toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAutoPost(link.platform)}
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      isAutoPost(link.platform)
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                    title="Toggle auto-posting to this platform"
                  >
                    {isAutoPost(link.platform) ? (
                      <ToggleRight className="h-3.5 w-3.5" />
                    ) : (
                      <ToggleLeft className="h-3.5 w-3.5" />
                    )}
                    Auto-Post
                  </button>
                </div>

                {/* Enabled toggle */}
                <button
                  onClick={() => toggleLinkEnabled(link.platform)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    link.enabled
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {link.enabled ? 'Visible' : 'Hidden'}
                </button>

                {/* Delete */}
                <button
                  onClick={() => removeSocialLink(link.platform)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Platform */}
      <div className="rounded-xl border bg-gray-50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Add Social Platform</h3>

        {/* Quick-add from defaults */}
        {availablePlatforms.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs text-gray-500">Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {availablePlatforms.map((p) => (
                <button
                  key={p.platform}
                  onClick={() => addSocialLink(p.platform, p.label)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700"
                >
                  <Plus className="h-3 w-3" />
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom platform */}
        <div>
          <p className="mb-2 text-xs text-gray-500">Or add a custom platform:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPlatformLabel}
              onChange={(e) => {
                setNewPlatformLabel(e.target.value);
                setNewPlatformName(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_'));
              }}
              placeholder="Display Name (e.g. Mastodon)"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={newPlatformName}
              onChange={(e) => setNewPlatformName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="Key (e.g. mastodon)"
              className="w-40 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-mono text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={addCustomPlatform}
              disabled={!newPlatformName || !newPlatformLabel}
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Info box */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <p className="font-medium">How it works:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-blue-700">
          <li><strong>Visible</strong> links are displayed on the website footer/sidebar</li>
          <li><strong>Auto-Post</strong> enabled platforms will receive article links when the agent publishes</li>
          <li>API credentials for auto-posting must still be configured in the agent environment variables</li>
          <li>You can add any custom social platform using the &quot;Add Custom&quot; option</li>
        </ul>
      </div>
    </div>
  );
}
