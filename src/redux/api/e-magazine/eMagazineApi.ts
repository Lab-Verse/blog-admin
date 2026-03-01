import { baseApi } from '../baseApi';
import type {
  EMagazine,
  PaginatedEMagazineResponse,
  GetEMagazineQuery,
  CreateEMagazinePayload,
  UpdateEMagazinePayload,
} from '../../types/e-magazine/e-magazine.types';

export const eMagazineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /e-magazines
    getEMagazines: builder.query<PaginatedEMagazineResponse, GetEMagazineQuery | void>({
      query: (params) => ({
        url: '/e-magazines',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result?.data?.length
          ? [
              ...result.data.map((item) => ({
                type: 'EMagazine' as const,
                id: item.id,
              })),
              { type: 'EMagazine' as const, id: 'LIST' },
            ]
          : [{ type: 'EMagazine' as const, id: 'LIST' }],
    }),

    // GET /e-magazines/:slug
    getEMagazineBySlug: builder.query<EMagazine, string>({
      query: (slug) => ({
        url: `/e-magazines/${slug}`,
        method: 'GET',
      }),
      providesTags: (_res, _err, slug) => [{ type: 'EMagazine', id: slug }],
    }),

    // POST /e-magazines (multipart form)
    createEMagazine: builder.mutation<EMagazine, CreateEMagazinePayload>({
      query: (payload) => {
        const formData = new FormData();
        formData.append('title', payload.title);
        if (payload.description) formData.append('description', payload.description);
        formData.append('issue_number', String(payload.issue_number));
        if (payload.published_date) formData.append('published_date', payload.published_date);
        if (payload.status) formData.append('status', payload.status);
        if (payload.page_count) formData.append('page_count', String(payload.page_count));
        if (payload.category_id) formData.append('category_id', payload.category_id);
        if (payload.tag_ids?.length) {
          payload.tag_ids.forEach((id) => formData.append('tag_ids[]', id));
        }
        formData.append('pdf_file', payload.pdf_file);
        if (payload.cover_image) formData.append('cover_image', payload.cover_image);

        return {
          url: '/e-magazines',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [{ type: 'EMagazine', id: 'LIST' }],
    }),

    // PATCH /e-magazines/:id (multipart form)
    updateEMagazine: builder.mutation<EMagazine, UpdateEMagazinePayload>({
      query: ({ id, ...payload }) => {
        const formData = new FormData();
        if (payload.title) formData.append('title', payload.title);
        if (payload.description !== undefined) formData.append('description', payload.description ?? '');
        if (payload.issue_number !== undefined) formData.append('issue_number', String(payload.issue_number));
        if (payload.published_date) formData.append('published_date', payload.published_date);
        if (payload.status) formData.append('status', payload.status);
        if (payload.page_count !== undefined) formData.append('page_count', String(payload.page_count));
        if (payload.category_id) formData.append('category_id', payload.category_id);
        if (payload.tag_ids) {
          payload.tag_ids.forEach((tagId) => formData.append('tag_ids[]', tagId));
        }
        if (payload.pdf_file) formData.append('pdf_file', payload.pdf_file);
        if (payload.cover_image) formData.append('cover_image', payload.cover_image);

        return {
          url: `/e-magazines/${id}`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'EMagazine', id },
        { type: 'EMagazine', id: 'LIST' },
      ],
    }),

    // DELETE /e-magazines/:id
    deleteEMagazine: builder.mutation<void, string>({
      query: (id) => ({
        url: `/e-magazines/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'EMagazine', id },
        { type: 'EMagazine', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEMagazinesQuery,
  useGetEMagazineBySlugQuery,
  useCreateEMagazineMutation,
  useUpdateEMagazineMutation,
  useDeleteEMagazineMutation,
} = eMagazineApi;
