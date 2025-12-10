// src/app/redux/api/answersApi.ts

import { baseApi } from '../baseApi';
import type {
  Answer,
  CreateAnswerDto,
  GetAnswersQuery,
  PaginatedAnswersResponse,
  UpdateAnswerDto,
} from '../../types/answer/answers.types';

export const answersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /answers
    getAnswers: builder.query<PaginatedAnswersResponse, GetAnswersQuery | void>({
      query: (params) => ({
        url: '/answers',
        method: 'GET',
        params: params === undefined ? undefined : params,
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map((answer) => ({
              type: 'Answer' as const,
              id: answer.id,
            })),
            { type: 'Answer' as const, id: 'LIST' },
          ]
          : [{ type: 'Answer' as const, id: 'LIST' }],
    }),

    // GET /answers/:id
    getAnswerById: builder.query<Answer, string>({
      query: (id) => ({
        url: `/answers/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [
        { type: 'Answer', id },
        { type: 'Answer', id: 'LIST' },
      ],
    }),

    // POST /answers
    createAnswer: builder.mutation<Answer, CreateAnswerDto>({
      query: (body) => ({
        url: '/answers',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Answer', id: 'LIST' }],
    }),

    // PATCH /answers/:id
    updateAnswer: builder.mutation<Answer, { id: string; data: UpdateAnswerDto }>({
      query: ({ id, data }) => ({
        url: `/answers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Answer', id },
        { type: 'Answer', id: 'LIST' },
      ],
    }),

    // DELETE /answers/:id
    deleteAnswer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/answers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Answer', id },
        { type: 'Answer', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAnswersQuery,
  useGetAnswerByIdQuery,
  useCreateAnswerMutation,
  useUpdateAnswerMutation,
  useDeleteAnswerMutation,
} = answersApi;
