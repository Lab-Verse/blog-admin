/** Supported locales for content translation */
export const SUPPORTED_LOCALES = ['en', 'ur', 'ar', 'ko', 'zh', 'es'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: 'English',
  ur: 'Urdu',
  ar: 'Arabic',
  ko: 'Korean',
  zh: 'Chinese',
  es: 'Spanish',
};

export const RTL_LOCALES: SupportedLocale[] = ['ur', 'ar'];

// ========================
// Post Translations
// ========================

export interface PostTranslation {
  id: string;
  post_id: string;
  locale: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface UpsertPostTranslationDto {
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  description?: string;
}

// ========================
// Category Translations
// ========================

export interface CategoryTranslation {
  id: string;
  category_id: string;
  locale: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface UpsertCategoryTranslationDto {
  name: string;
  slug: string;
  description?: string;
}

// ========================
// Tag Translations
// ========================

export interface TagTranslation {
  id: string;
  tag_id: string;
  locale: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface UpsertTagTranslationDto {
  name: string;
  slug: string;
}
