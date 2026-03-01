'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Trash2, Globe, Check, AlertCircle } from 'lucide-react';
import {
  useGetPostTranslationsQuery,
  useUpsertPostTranslationMutation,
  useDeletePostTranslationMutation,
} from '@/redux/api/translations/translationsApi';
import { useGetPostByIdQuery } from '@/redux/api/post/posts.api';
import {
  SUPPORTED_LOCALES,
  LOCALE_LABELS,
  RTL_LOCALES,
  type SupportedLocale,
  type UpsertPostTranslationDto,
} from '@/redux/types/translations/types';

interface Props {
  postId: string;
  onBack: () => void;
}

export default function PostTranslationEditor({ postId, onBack }: Props) {
  const { data: post, isLoading: postLoading } = useGetPostByIdQuery(postId);
  const { data: translations, isLoading: translationsLoading } = useGetPostTranslationsQuery(postId);
  const [upsertTranslation, { isLoading: saving }] = useUpsertPostTranslationMutation();
  const [deleteTranslation, { isLoading: deleting }] = useDeletePostTranslationMutation();

  const [selectedLocale, setSelectedLocale] = useState<SupportedLocale>('ur');
  const [form, setForm] = useState<UpsertPostTranslationDto>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    description: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const nonEnglishLocales = SUPPORTED_LOCALES.filter((l) => l !== 'en');
  const translatedLocales = new Set((translations || []).map((t) => t.locale));
  const isRtl = RTL_LOCALES.includes(selectedLocale);

  // Load existing translation when locale changes  
  useEffect(() => {
    const existing = translations?.find((t) => t.locale === selectedLocale);
    if (existing) {
      setForm({
        title: existing.title,
        slug: existing.slug,
        content: existing.content || '',
        excerpt: existing.excerpt || '',
        description: existing.description || '',
      });
    } else {
      setForm({ title: '', slug: '', content: '', excerpt: '', description: '' });
    }
    setMessage(null);
  }, [selectedLocale, translations]);

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      setMessage({ type: 'error', text: 'Title and slug are required' });
      return;
    }
    try {
      await upsertTranslation({ postId, locale: selectedLocale, data: form }).unwrap();
      setMessage({ type: 'success', text: `${LOCALE_LABELS[selectedLocale]} translation saved!` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.data?.message || 'Failed to save translation' });
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${LOCALE_LABELS[selectedLocale]} translation?`)) return;
    try {
      await deleteTranslation({ postId, locale: selectedLocale }).unwrap();
      setForm({ title: '', slug: '', content: '', excerpt: '', description: '' });
      setMessage({ type: 'success', text: 'Translation deleted' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.data?.message || 'Failed to delete translation' });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s\u0600-\u06FF\uAC00-\uD7AF\u4E00-\u9FFF-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  if (postLoading || translationsLoading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Back Button & Post Info */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to posts
          </Button>
          <h2 className="text-xl font-semibold text-gray-900">{post?.title || 'Post'}</h2>
          <p className="text-sm text-gray-500 mt-0.5">/{post?.slug}</p>
        </div>
      </div>

      {/* Locale Selector */}
      <div className="flex flex-wrap gap-2">
        {nonEnglishLocales.map((locale) => {
          const hasTranslation = translatedLocales.has(locale);
          const isSelected = selectedLocale === locale;
          return (
            <Button
              key={locale}
              variant={isSelected ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedLocale(locale)}
              className={`gap-1.5 ${hasTranslation && !isSelected ? 'border-green-300 text-green-700' : ''}`}
            >
              <Globe className="w-3.5 h-3.5" />
              {LOCALE_LABELS[locale]}
              {hasTranslation && <Check className="w-3.5 h-3.5 text-green-500" />}
            </Button>
          );
        })}
      </div>

      {/* Message */}
      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {/* Original Content (Reference) */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Original (English)</h3>
          <p className="font-medium text-gray-900">{post?.title}</p>
          {post?.excerpt && <p className="text-sm text-gray-600 mt-1">{post.excerpt}</p>}
        </CardContent>
      </Card>

      {/* Translation Form */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {LOCALE_LABELS[selectedLocale]} Translation
            {isRtl && <Badge variant="outline" className="text-xs">RTL</Badge>}
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <Input
              dir={isRtl ? 'rtl' : 'ltr'}
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                if (!translatedLocales.has(selectedLocale)) {
                  setForm((f) => ({ ...f, title: e.target.value, slug: generateSlug(e.target.value) }));
                }
              }}
              placeholder={`Enter ${LOCALE_LABELS[selectedLocale]} title`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <Input
              dir="ltr"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="url-friendly-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              dir={isRtl ? 'rtl' : 'ltr'}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder={`Enter ${LOCALE_LABELS[selectedLocale]} excerpt`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              dir={isRtl ? 'rtl' : 'ltr'}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder={`Enter ${LOCALE_LABELS[selectedLocale]} description`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              dir={isRtl ? 'rtl' : 'ltr'}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono"
              rows={12}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder={`Enter ${LOCALE_LABELS[selectedLocale]} content (Markdown/HTML)`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            {translatedLocales.has(selectedLocale) && (
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                <Trash2 className="w-4 h-4 mr-1" />
                {deleting ? 'Deleting...' : 'Delete Translation'}
              </Button>
            )}
            <div className="ml-auto">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-1" />
                {saving ? 'Saving...' : translatedLocales.has(selectedLocale) ? 'Update Translation' : 'Create Translation'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
