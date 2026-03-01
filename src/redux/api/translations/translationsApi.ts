import { baseApi } from '../baseApi';
import type {
  PostTranslation,
  UpsertPostTranslationDto,
  CategoryTranslation,
  UpsertCategoryTranslationDto,
  TagTranslation,
  UpsertTagTranslationDto,
} from '../../types/translations/types';

export const translationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========================
    // Post Translations
    // ========================

    /** GET /posts/:postId/translations */
    getPostTranslations: builder.query<PostTranslation[], string>({
      query: (postId) => `/posts/${postId}/translations`,
      providesTags: (_res, _err, postId) => [
        { type: 'PostTranslation', id: postId },
      ],
    }),

    /** PUT /posts/:postId/translations/:locale */
    upsertPostTranslation: builder.mutation<
      PostTranslation,
      { postId: string; locale: string; data: UpsertPostTranslationDto }
    >({
      query: ({ postId, locale, data }) => ({
        url: `/posts/${postId}/translations/${locale}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_res, _err, { postId }) => [
        { type: 'PostTranslation', id: postId },
      ],
    }),

    /** DELETE /posts/:postId/translations/:locale */
    deletePostTranslation: builder.mutation<void, { postId: string; locale: string }>({
      query: ({ postId, locale }) => ({
        url: `/posts/${postId}/translations/${locale}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, { postId }) => [
        { type: 'PostTranslation', id: postId },
      ],
    }),

    // ========================
    // Category Translations
    // ========================

    /** GET /categories/:categoryId/translations */
    getCategoryTranslations: builder.query<CategoryTranslation[], string>({
      query: (categoryId) => `/categories/${categoryId}/translations`,
      providesTags: (_res, _err, categoryId) => [
        { type: 'CategoryTranslation', id: categoryId },
      ],
    }),

    /** PUT /categories/:categoryId/translations/:locale */
    upsertCategoryTranslation: builder.mutation<
      CategoryTranslation,
      { categoryId: string; locale: string; data: UpsertCategoryTranslationDto }
    >({
      query: ({ categoryId, locale, data }) => ({
        url: `/categories/${categoryId}/translations/${locale}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_res, _err, { categoryId }) => [
        { type: 'CategoryTranslation', id: categoryId },
      ],
    }),

    /** DELETE /categories/:categoryId/translations/:locale */
    deleteCategoryTranslation: builder.mutation<void, { categoryId: string; locale: string }>({
      query: ({ categoryId, locale }) => ({
        url: `/categories/${categoryId}/translations/${locale}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, { categoryId }) => [
        { type: 'CategoryTranslation', id: categoryId },
      ],
    }),

    // ========================
    // Tag Translations
    // ========================

    /** GET /tags/:tagId/translations */
    getTagTranslations: builder.query<TagTranslation[], string>({
      query: (tagId) => `/tags/${tagId}/translations`,
      providesTags: (_res, _err, tagId) => [
        { type: 'TagTranslation', id: tagId },
      ],
    }),

    /** PUT /tags/:tagId/translations/:locale */
    upsertTagTranslation: builder.mutation<
      TagTranslation,
      { tagId: string; locale: string; data: UpsertTagTranslationDto }
    >({
      query: ({ tagId, locale, data }) => ({
        url: `/tags/${tagId}/translations/${locale}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_res, _err, { tagId }) => [
        { type: 'TagTranslation', id: tagId },
      ],
    }),

    /** DELETE /tags/:tagId/translations/:locale */
    deleteTagTranslation: builder.mutation<void, { tagId: string; locale: string }>({
      query: ({ tagId, locale }) => ({
        url: `/tags/${tagId}/translations/${locale}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, { tagId }) => [
        { type: 'TagTranslation', id: tagId },
      ],
    }),
  }),
});

export const {
  // Post translations
  useGetPostTranslationsQuery,
  useUpsertPostTranslationMutation,
  useDeletePostTranslationMutation,
  // Category translations
  useGetCategoryTranslationsQuery,
  useUpsertCategoryTranslationMutation,
  useDeleteCategoryTranslationMutation,
  // Tag translations
  useGetTagTranslationsQuery,
  useUpsertTagTranslationMutation,
  useDeleteTagTranslationMutation,
} = translationsApi;
