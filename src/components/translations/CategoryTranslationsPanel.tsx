'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ChevronRight, Globe, Check, X, ArrowLeft, Save, Trash2, AlertCircle } from 'lucide-react';
import { useGetCategoriesQuery } from '@/redux/api/category/categoriesApi';
import {
  useGetCategoryTranslationsQuery,
  useUpsertCategoryTranslationMutation,
  useDeleteCategoryTranslationMutation,
} from '@/redux/api/translations/translationsApi';
import {
  SUPPORTED_LOCALES,
  LOCALE_LABELS,
  RTL_LOCALES,
  type SupportedLocale,
  type UpsertCategoryTranslationDto,
} from '@/redux/types/translations/types';

export default function CategoryTranslationsPanel() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const { data: categoriesData, isLoading } = useGetCategoriesQuery();

  const categories = categoriesData?.items || (Array.isArray(categoriesData) ? categoriesData : []);

  if (selectedCategoryId) {
    const cat = (categories as any[]).find((c: any) => c.id === selectedCategoryId);
    return (
      <CategoryTranslationEditor
        categoryId={selectedCategoryId}
        categoryName={cat?.name || 'Category'}
        categorySlug={cat?.slug || ''}
        categoryDescription={cat?.description || ''}
        onBack={() => setSelectedCategoryId(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading categories...</div>
      ) : (categories as any[]).length === 0 ? (
        <div className="text-center py-12 text-gray-500">No categories found</div>
      ) : (
        <div className="space-y-2">
          {(categories as any[]).map((cat: any) => (
            <CategoryRow
              key={cat.id}
              categoryId={cat.id}
              name={cat.name}
              slug={cat.slug}
              onClick={() => setSelectedCategoryId(cat.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryRow({
  categoryId,
  name,
  slug,
  onClick,
}: {
  categoryId: string;
  name: string;
  slug: string;
  onClick: () => void;
}) {
  const { data: translations } = useGetCategoryTranslationsQuery(categoryId);
  const translatedLocales = new Set((translations || []).map((t) => t.locale));
  const nonEnglishLocales = SUPPORTED_LOCALES.filter((l) => l !== 'en');
  const translatedCount = nonEnglishLocales.filter((l) => translatedLocales.has(l)).length;

  return (
    <div onClick={onClick} className="cursor-pointer">
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">/{slug}</p>
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
                {translatedLocales.has(locale) ? <Check className="w-2.5 h-2.5 ml-0.5" /> : <X className="w-2.5 h-2.5 ml-0.5" />}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <div className="text-right">
            <span className="text-sm font-medium">{translatedCount}/{nonEnglishLocales.length}</span>
            <p className="text-xs text-gray-500">translations</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

function CategoryTranslationEditor({
  categoryId,
  categoryName,
  categorySlug,
  categoryDescription,
  onBack,
}: {
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  categoryDescription: string;
  onBack: () => void;
}) {
  const { data: translations, isLoading } = useGetCategoryTranslationsQuery(categoryId);
  const [upsertTranslation, { isLoading: saving }] = useUpsertCategoryTranslationMutation();
  const [deleteTranslation, { isLoading: deleting }] = useDeleteCategoryTranslationMutation();

  const [selectedLocale, setSelectedLocale] = useState<SupportedLocale>('ur');
  const [form, setForm] = useState<UpsertCategoryTranslationDto>({ name: '', slug: '', description: '' });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const nonEnglishLocales = SUPPORTED_LOCALES.filter((l) => l !== 'en');
  const translatedLocales = new Set((translations || []).map((t) => t.locale));
  const isRtl = RTL_LOCALES.includes(selectedLocale);

  useEffect(() => {
    const existing = translations?.find((t) => t.locale === selectedLocale);
    if (existing) {
      setForm({ name: existing.name, slug: existing.slug, description: existing.description || '' });
    } else {
      setForm({ name: '', slug: '', description: '' });
    }
    setMessage(null);
  }, [selectedLocale, translations]);

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      setMessage({ type: 'error', text: 'Name and slug are required' });
      return;
    }
    try {
      await upsertTranslation({ categoryId, locale: selectedLocale, data: form }).unwrap();
      setMessage({ type: 'success', text: `${LOCALE_LABELS[selectedLocale]} translation saved!` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.data?.message || 'Failed to save' });
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${LOCALE_LABELS[selectedLocale]} translation?`)) return;
    try {
      await deleteTranslation({ categoryId, locale: selectedLocale }).unwrap();
      setForm({ name: '', slug: '', description: '' });
      setMessage({ type: 'success', text: 'Translation deleted' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.data?.message || 'Failed to delete' });
    }
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^\w\s\u0600-\u06FF\uAC00-\uD7AF\u4E00-\u9FFF-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

  if (isLoading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to categories
        </Button>
        <h2 className="text-xl font-semibold text-gray-900">{categoryName}</h2>
        <p className="text-sm text-gray-500">/{categorySlug}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {nonEnglishLocales.map((locale) => (
          <Button
            key={locale}
            variant={selectedLocale === locale ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedLocale(locale)}
            className={`gap-1.5 ${translatedLocales.has(locale) && selectedLocale !== locale ? 'border-green-300 text-green-700' : ''}`}
          >
            <Globe className="w-3.5 h-3.5" />
            {LOCALE_LABELS[locale]}
            {translatedLocales.has(locale) && <Check className="w-3.5 h-3.5 text-green-500" />}
          </Button>
        ))}
      </div>

      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Original (English)</h3>
          <p className="font-medium text-gray-900">{categoryName}</p>
          {categoryDescription && <p className="text-sm text-gray-600 mt-1">{categoryDescription}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {LOCALE_LABELS[selectedLocale]} Translation
            {isRtl && <Badge variant="outline" className="text-xs">RTL</Badge>}
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <Input
              dir={isRtl ? 'rtl' : 'ltr'}
              value={form.name}
              onChange={(e) => {
                const newName = e.target.value;
                setForm((f) => ({
                  ...f,
                  name: newName,
                  ...(!translatedLocales.has(selectedLocale) ? { slug: generateSlug(newName) } : {}),
                }));
              }}
              placeholder={`Enter ${LOCALE_LABELS[selectedLocale]} name`}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              dir={isRtl ? 'rtl' : 'ltr'}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder={`Enter ${LOCALE_LABELS[selectedLocale]} description`}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            {translatedLocales.has(selectedLocale) && (
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                <Trash2 className="w-4 h-4 mr-1" />
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
            <div className="ml-auto">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-1" />
                {saving ? 'Saving...' : translatedLocales.has(selectedLocale) ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
