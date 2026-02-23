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
      transformResponse: (response: any) => {
        const mapMedia = (item: any): Media => ({
          id: item.id,
          url: item.file_url || item.url,
          type: item.type || 'image',
          filename: item.filename,
          mimeType: item.mime_type || item.mimeType,
          size: item.file_size || item.size,
          title: item.title,
          altText: item.altText,
          description: item.description,
          folder: item.folder,
          ownerId: item.user_id || item.ownerId,
          createdAt: item.created_at || item.createdAt,
          updatedAt: item.updated_at || item.updatedAt,
        });

        if (Array.isArray(response)) {
          return response.map(mapMedia);
        }
        return {
          items: response.items?.map(mapMedia) || [],
          total: response.total || 0,
          page: response.page || 1,
          limit: response.limit || 24,
        };
      },
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

    // POST /media/upload  (file upload with FormData)
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
          url: '/media/upload',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: any): Media => ({
        id: response.id,
        url: response.file_url || response.url,
        type: response.type || 'image',
        filename: response.filename,
        mimeType: response.mime_type || response.mimeType,
        size: response.file_size || response.size,
        title: response.title,
        altText: response.altText,
        description: response.description,
        folder: response.folder,
        ownerId: response.user_id || response.ownerId,
        createdAt: response.created_at || response.createdAt,
        updatedAt: response.updated_at || response.updatedAt,
      }),
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
