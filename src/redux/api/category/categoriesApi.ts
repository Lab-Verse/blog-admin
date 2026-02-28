// src/app/redux/api/categoriesApi.ts

import { baseApi } from '../baseApi';
import type {
  Category,
  CreateCategoryDto,
  GetCategoriesQuery,
  PaginatedCategoriesResponse,
  UpdateCategoryDto,
} from '../../types/category/categories.types';

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /categories
    getCategories: builder.query<
      PaginatedCategoriesResponse,
      GetCategoriesQuery | void
    >({
      query: (params) => ({
        url: '/categories',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result && result.items
          ? [
            ...result.items.map((cat) => ({
              type: 'Category' as const,
              id: cat.id,
            })),
            { type: 'Category' as const, id: 'LIST' },
          ]
          : [{ type: 'Category' as const, id: 'LIST' }],
    }),

    // GET /categories/:id
    getCategoryById: builder.query<Category, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'GET',
      }),
      providesTags: (_res, _err, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    // POST /categories (with optional image upload)
    createCategory: builder.mutation<Category, CreateCategoryDto | FormData>({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    // PATCH /categories/:id (with optional image upload)
    updateCategory: builder.mutation<
      Category,
      { id: string; data: UpdateCategoryDto | FormData }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    // DELETE /categories/:id
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
