'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Languages, FileText, FolderOpen, Tag, Search, Globe } from 'lucide-react';
import PostTranslationsPanel from '@/components/translations/PostTranslationsPanel';
import CategoryTranslationsPanel from '@/components/translations/CategoryTranslationsPanel';
import TagTranslationsPanel from '@/components/translations/TagTranslationsPanel';

type TabType = 'posts' | 'categories' | 'tags';

const tabs: { key: TabType; label: string; icon: React.ElementType; description: string }[] = [
  { key: 'posts', label: 'Posts', icon: FileText, description: 'Translate post titles, content, and excerpts' },
  { key: 'categories', label: 'Categories', icon: FolderOpen, description: 'Translate category names and descriptions' },
  { key: 'tags', label: 'Tags', icon: Tag, description: 'Translate tag names' },
];

export default function TranslationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('posts');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Languages className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Translations</h1>
            <p className="text-sm text-gray-500">
              Manage multilingual content for posts, categories, and tags
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm gap-1">
          <Globe className="w-3.5 h-3.5" />
          6 Languages
        </Badge>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`group inline-flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'posts' && <PostTranslationsPanel />}
        {activeTab === 'categories' && <CategoryTranslationsPanel />}
        {activeTab === 'tags' && <TagTranslationsPanel />}
      </div>
    </div>
  );
}
