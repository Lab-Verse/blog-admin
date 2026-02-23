// src/app/redux/api/questions.api.ts

import { baseApi } from '../baseApi';
import {
  Question,
  QuestionsQueryParams,
  CreateQuestionRequest,
  UpdateQuestionRequest,
} from '../../types/question/questions.types';

const normalizeQuestion = (question: any): Question => ({
  id: String(question.id),
  user_id: String(question.user_id),
  title: question.title,
  slug: question.slug,
  content: question.content,
  category_id: String(question.category_id),
  status: question.status || 'open',
  created_at: question.created_at,
  updated_at: question.updated_at,
  user: question.user
    ? {
        id: String(question.user.id),
        name: question.user.name || question.user.username,
        email: question.user.email,
      }
    : undefined,
  category: question.category
    ? {
        id: String(question.category.id),
        name: question.category.name,
        slug: question.category.slug,
      }
    : undefined,
});

const normalizeQuestionsList = (response: any): Question[] => {
  if (Array.isArray(response)) {
    return response.map(normalizeQuestion);
  }

  const items = Array.isArray(response?.items)
    ? response.items
    : Array.isArray(response?.data?.items)
      ? response.data.items
      : Array.isArray(response?.data)
        ? response.data
        : [];

  return items.map(normalizeQuestion);
};

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
      transformResponse: (response: any) => normalizeQuestionsList(response),
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
      transformResponse: (response: any) => normalizeQuestion(response?.data ?? response),
      providesTags: (result, _err, id) => [{ type: 'Question' as const, id }],
    }),

    /** Create */
    createQuestion: builder.mutation<Question, CreateQuestionRequest>({
      query: (body) => ({
        url: '/questions',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => normalizeQuestion(response?.data ?? response),
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
      transformResponse: (response: any) => normalizeQuestion(response?.data ?? response),
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
