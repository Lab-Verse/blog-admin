import { baseApi } from '../baseApi';
import type { Tag, CreateTagDto, UpdateTagDto } from '../../types/tags/types';

export const tagsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query<Tag[], void>({
      query: () => '/tags',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Tag' as const, id })),
              { type: 'Tag' as const, id: 'LIST' },
            ]
          : [{ type: 'Tag' as const, id: 'LIST' }],
    }),
    getTagById: builder.query<Tag, string>({
      query: (id) => `/tags/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tag', id }],
    }),
    createTag: builder.mutation<Tag, CreateTagDto>({
      query: (body) => ({
        url: '/tags',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Tag', id: 'LIST' }],
    }),
    updateTag: builder.mutation<Tag, { id: string; data: UpdateTagDto }>({
      query: ({ id, data }) => ({
        url: `/tags/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Tag', id },
        { type: 'Tag', id: 'LIST' },
      ],
    }),
    deleteTag: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Tag', id },
        { type: 'Tag', id: 'LIST' },
      ],
    }),
    getPostsByTag: builder.query<unknown[], string>({
      query: (id) => `/tags/${id}/posts`,
      providesTags: (result, error, id) => [{ type: 'Tag', id: `${id}-posts` }],
    }),
  }),
});

export const {
  useGetTagsQuery,
  useGetTagByIdQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useGetPostsByTagQuery,
} = tagsApi;
