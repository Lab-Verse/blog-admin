'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ChevronRight, Globe, Check, X } from 'lucide-react';
import { useGetPostsQuery } from '@/redux/api/post/posts.api';
import { useGetPostTranslationsQuery } from '@/redux/api/translations/translationsApi';
import { SUPPORTED_LOCALES, LOCALE_LABELS } from '@/redux/types/translations/types';
import PostTranslationEditor from './PostTranslationEditor';

export default function PostTranslationsPanel() {
  const [search, setSearch] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: postsData, isLoading } = useGetPostsQuery({ page, limit: 20, search: search || undefined });
  const posts = postsData?.data || [];
  const totalPages = postsData ? Math.ceil(postsData.total / 20) : 1;

  if (selectedPostId) {
    return (
      <PostTranslationEditor
        postId={selectedPostId}
        onBack={() => setSelectedPostId(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search posts by title..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-10"
        />
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No posts found</div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <PostRow
              key={post.id}
              postId={post.id}
              title={post.title}
              slug={post.slug}
              status={post.status}
              onClick={() => setSelectedPostId(post.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function PostRow({
  postId,
  title,
  slug,
  status,
  onClick,
}: {
  postId: string;
  title: string;
  slug: string;
  status: string;
  onClick: () => void;
}) {
  const { data: translations } = useGetPostTranslationsQuery(postId);
  const translatedLocales = new Set((translations || []).map((t) => t.locale));
  // Count non-English translations
  const nonEnglishLocales = SUPPORTED_LOCALES.filter((l) => l !== 'en');
  const translatedCount = nonEnglishLocales.filter((l) => translatedLocales.has(l)).length;

  return (
    <div onClick={onClick} className="cursor-pointer">
    <Card
      className="hover:shadow-md transition-shadow"
    >
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 truncate">{title}</h3>
            <Badge variant={status === 'published' ? 'default' : 'secondary'} className="text-xs shrink-0">
              {status}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 truncate mt-0.5">/{slug}</p>
          {/* Translation status indicators */}
          <div className="flex items-center gap-1.5 mt-2">
            {nonEnglishLocales.map((locale) => (
              <Badge
                key={locale}
                variant="outline"
                className={`text-[10px] px-1.5 py-0 ${
                  translatedLocales.has(locale)
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-gray-50 text-gray-400 border-gray-200'
                }`}
              >
                {locale.toUpperCase()}
                {translatedLocales.has(locale) ? (
                  <Check className="w-2.5 h-2.5 ml-0.5" />
                ) : (
                  <X className="w-2.5 h-2.5 ml-0.5" />
                )}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <div className="text-right">
            <span className="text-sm font-medium text-gray-900">
              {translatedCount}/{nonEnglishLocales.length}
            </span>
            <p className="text-xs text-gray-500">translations</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
