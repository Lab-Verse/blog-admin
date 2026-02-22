// src/app/redux/api/mediaApi.ts

import { baseApi } from '../baseApi';
import type {
  GetMediaQuery,
  Media,
  PaginatedMediaResponse,
  UpdateMediaDto,
  UploadMediaPayload,
} from '../../types/media/media.types';

const getMediaItems = (
  result?: PaginatedMediaResponse | Media[],
): Media[] => {
  if (!result) return [];
  return Array.isArray(result) ? result : result.items ?? [];
};

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /media
    getMedia: builder.query<PaginatedMediaResponse | Media[], GetMediaQuery | void>({
      query: (params) => ({
        url: '/media',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        getMediaItems(result).length > 0
          ? [
              ...getMediaItems(result).map((item: Media) => ({
                type: 'Media' as const,
                id: item.id,
              })),
              { type: 'Media' as const, id: 'LIST' },
            ]
          : [{ type: 'Media' as const, id: 'LIST' }],
    }),

    // GET /media/:id
    getMediaById: builder.query<Media, string>({
      query: (id) => ({
        url: `/media/${id}`,
        method: 'GET',
      }),
      providesTags: (_res, _err, id) => [
        { type: 'Media', id },
        { type: 'Media', id: 'LIST' },
      ],
    }),

    // POST /media  (file upload with FormData)
    uploadMedia: builder.mutation<Media, UploadMediaPayload>({
      query: ({ file, data }) => {
        const formData = new FormData();
        formData.append('file', file);
        if (data) {
          Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formData.append(key, String(value));
            }
          });
        }

        return {
          url: '/media',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [{ type: 'Media', id: 'LIST' }],
    }),

    // PATCH /media/:id
    updateMedia: builder.mutation<Media, { id: string; data: UpdateMediaDto }>({
      query: ({ id, data }) => ({
        url: `/media/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Media', id },
        { type: 'Media', id: 'LIST' },
      ],
    }),

    // DELETE /media/:id
    deleteMedia: builder.mutation<void, string>({
      query: (id) => ({
        url: `/media/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Media', id },
        { type: 'Media', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMediaQuery,
  useGetMediaByIdQuery,
  useUploadMediaMutation,
  useUpdateMediaMutation,
  useDeleteMediaMutation,
} = mediaApi;
