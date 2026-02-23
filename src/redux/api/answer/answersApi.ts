// src/app/redux/api/answersApi.ts

import { baseApi } from '../baseApi';
import type {
  Answer,
  CreateAnswerDto,
  GetAnswersQuery,
  PaginatedAnswersResponse,
  UpdateAnswerDto,
} from '../../types/answer/answers.types';

const normalizeAnswer = (answer: any): Answer => ({
  id: String(answer.id),
  content: answer.content,
  questionId: String(answer.question_id ?? answer.questionId ?? ''),
  authorId: String(answer.user_id ?? answer.authorId ?? ''),
  isAccepted: Boolean(answer.is_accepted ?? answer.isAccepted ?? false),
  upvotes: Number(answer.upvotes ?? answer.votes_count ?? 0),
  downvotes: Number(answer.downvotes ?? 0),
  status: answer.status ?? 'published',
  createdAt: answer.created_at ?? answer.createdAt,
  updatedAt: answer.updated_at ?? answer.updatedAt,
  question: answer.question
    ? {
        id: String(answer.question.id),
        title: answer.question.title,
      }
    : undefined,
  user: answer.user
    ? {
        id: String(answer.user.id),
        username: answer.user.username,
        display_name: answer.user.display_name,
        email: answer.user.email,
      }
    : undefined,
});

const normalizeAnswersList = (response: any): PaginatedAnswersResponse => {
  if (Array.isArray(response)) {
    return {
      items: response.map(normalizeAnswer),
      total: response.length,
      page: 1,
      limit: response.length || 10,
    };
  }

  const items = Array.isArray(response?.items)
    ? response.items
    : Array.isArray(response?.data?.items)
      ? response.data.items
      : Array.isArray(response?.data)
        ? response.data
        : [];

  return {
    items: items.map(normalizeAnswer),
    total: Number(response?.total ?? response?.data?.total ?? items.length ?? 0),
    page: Number(response?.page ?? response?.data?.page ?? 1),
    limit: Number(response?.limit ?? response?.data?.limit ?? 10),
  };
};

export const answersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /answers
    getAnswers: builder.query<PaginatedAnswersResponse, GetAnswersQuery | void>({
      query: (params) => {
        const mappedParams = params
          ? {
              ...params,
              question_id: params.questionId,
              author_id: params.authorId,
            }
          : undefined;

        if (mappedParams) {
          delete (mappedParams as any).questionId;
          delete (mappedParams as any).authorId;
        }

        return {
        url: '/answers',
        method: 'GET',
        params: mappedParams,
      };
      },
      transformResponse: (response: any) => normalizeAnswersList(response),
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
      transformResponse: (response: any) => normalizeAnswer(response?.data ?? response),
      providesTags: (_result, _error, id) => [
        { type: 'Answer', id },
        { type: 'Answer', id: 'LIST' },
      ],
    }),

    // POST /answers
    createAnswer: builder.mutation<Answer, CreateAnswerDto>({
      query: (body) => {
        const payload = {
          content: body.content,
          question_id: body.questionId,
          user_id: body.userId,
        } as Record<string, any>;

        if (body.isAccepted !== undefined) {
          payload.is_accepted = body.isAccepted;
        }

        return {
          url: '/answers',
          method: 'POST',
          body: payload,
        };
      },
      transformResponse: (response: any) => normalizeAnswer(response?.data ?? response),
      invalidatesTags: [{ type: 'Answer', id: 'LIST' }],
    }),

    // PATCH /answers/:id
    updateAnswer: builder.mutation<Answer, { id: string; data: UpdateAnswerDto }>({
      query: ({ id, data }) => {
        const payload: Record<string, any> = {};

        if (data.content !== undefined) {
          payload.content = data.content;
        }
        if (data.isAccepted !== undefined) {
          payload.is_accepted = data.isAccepted;
        }
        if (data.status !== undefined) {
          payload.status = data.status;
        }

        return {
          url: `/answers/${id}`,
          method: 'PATCH',
          body: payload,
        };
      },
      transformResponse: (response: any) => normalizeAnswer(response?.data ?? response),
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
