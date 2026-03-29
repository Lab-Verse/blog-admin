'use client';

import { useState } from 'react';
import AgentLogsDashboard from '@/components/agent-logs/AgentLogsDashboard';
import AgentSettings from '@/components/agent-logs/AgentSettings';
import ReviewQueue from '@/components/agent-logs/ReviewQueue';
import CostDashboard from '@/components/agent-logs/CostDashboard';
import SocialDashboard from '@/components/agent-logs/SocialDashboard';
import SocialLinksManager from '@/components/agent-logs/SocialLinksManager';
import FeedSourcesManager from '@/components/agent-logs/FeedSourcesManager';
import SEOReportDashboard from '@/components/agent-logs/SEOReportDashboard';
import { BarChart3, Settings, ClipboardCheck, DollarSign, Share2, Rss, Search, Link2 } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'seo', label: 'SEO Reports', icon: Search },
  { id: 'feeds', label: 'Feed Sources', icon: Rss },
  { id: 'review', label: 'Review Queue', icon: ClipboardCheck },
  { id: 'social', label: 'Social Media', icon: Share2 },
  { id: 'social-links', label: 'Social Links', icon: Link2 },
  { id: 'costs', label: 'Costs', icon: DollarSign },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function AgentLogsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-1 rounded-lg border bg-gray-50 p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && <AgentLogsDashboard />}
      {activeTab === 'seo' && <SEOReportDashboard />}
      {activeTab === 'feeds' && <FeedSourcesManager />}
      {activeTab === 'review' && <ReviewQueue />}
      {activeTab === 'social' && <SocialDashboard />}
      {activeTab === 'social-links' && <SocialLinksManager />}
      {activeTab === 'costs' && <CostDashboard />}
      {activeTab === 'settings' && <AgentSettings />}
    </div>
  );
}
