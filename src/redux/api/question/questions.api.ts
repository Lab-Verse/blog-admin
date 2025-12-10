// src/app/redux/api/questions.api.ts

import { baseApi } from '../baseApi';
import {
  Question,
  QuestionsQueryParams,
  CreateQuestionRequest,
  UpdateQuestionRequest,
} from '../../types/question/questions.types';

const buildQueryString = (params?: QuestionsQueryParams): string => {
  if (!params) return '';
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) searchParams.set('page', String(params.page));
  if (params.limit !== undefined) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.category_id) searchParams.set('category_id', params.category_id);

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
};

export const questionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** List questions */
    getQuestions: builder.query<Question[], QuestionsQueryParams | void>({
      query: (params) => `/questions${buildQueryString(params || undefined)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((q) => ({ type: 'Question' as const, id: q.id })),
              { type: 'Question' as const, id: 'LIST' },
            ]
          : [{ type: 'Question' as const, id: 'LIST' }],
    }),

    /** Get single question */
    getQuestionById: builder.query<Question, string>({
      query: (id) => `/questions/${id}`,
      providesTags: (result, _err, id) => [{ type: 'Question' as const, id }],
    }),

    /** Create */
    createQuestion: builder.mutation<Question, CreateQuestionRequest>({
      query: (body) => ({
        url: '/questions',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Question', id: 'LIST' }],
    }),

    /** Update */
    updateQuestion: builder.mutation<
      Question,
      { id: string; body: UpdateQuestionRequest }
    >({
      query: ({ id, body }) => ({
        url: `/questions/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, _err, { id }) => [
        { type: 'Question', id },
        { type: 'Question', id: 'LIST' },
      ],
    }),

    /** Delete */
    deleteQuestion: builder.mutation<void, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, _err, id) => [
        { type: 'Question', id },
        { type: 'Question', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetQuestionsQuery,
  useGetQuestionByIdQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionsApi;
