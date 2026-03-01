import { baseApi } from '../baseApi';
import type {
  LeadershipMember,
  CreateLeadershipMemberPayload,
  UpdateLeadershipMemberPayload,
} from '../../types/leadership/leadership.types';

export const leadershipApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /leadership-members?active=false (show all in admin)
    getLeadershipMembers: builder.query<LeadershipMember[], boolean | void>({
      query: (showAll) => ({
        url: '/leadership-members',
        method: 'GET',
        params: showAll === false ? undefined : { active: 'false' },
      }),
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((m) => ({
                type: 'Leadership' as const,
                id: m.id,
              })),
              { type: 'Leadership' as const, id: 'LIST' },
            ]
          : [{ type: 'Leadership' as const, id: 'LIST' }],
    }),

    // GET /leadership-members/:id
    getLeadershipMemberById: builder.query<LeadershipMember, string>({
      query: (id) => ({
        url: `/leadership-members/${id}`,
        method: 'GET',
      }),
      providesTags: (_res, _err, id) => [{ type: 'Leadership', id }],
    }),

    // POST /leadership-members (multipart form)
    createLeadershipMember: builder.mutation<
      LeadershipMember,
      CreateLeadershipMemberPayload
    >({
      query: (payload) => {
        const formData = new FormData();
        formData.append('name', payload.name);
        formData.append('designation', payload.designation);
        if (payload.bio) formData.append('bio', payload.bio);
        if (payload.email) formData.append('email', payload.email);
        if (payload.website_url)
          formData.append('website_url', payload.website_url);
        if (payload.twitter_url)
          formData.append('twitter_url', payload.twitter_url);
        if (payload.linkedin_url)
          formData.append('linkedin_url', payload.linkedin_url);
        if (payload.facebook_url)
          formData.append('facebook_url', payload.facebook_url);
        if (payload.instagram_url)
          formData.append('instagram_url', payload.instagram_url);
        if (payload.display_order !== undefined)
          formData.append('display_order', String(payload.display_order));
        if (payload.is_active !== undefined)
          formData.append('is_active', String(payload.is_active));
        if (payload.user_id) formData.append('user_id', payload.user_id);
        if (payload.photo) formData.append('photo', payload.photo);

        return { url: '/leadership-members', method: 'POST', body: formData };
      },
      invalidatesTags: [{ type: 'Leadership', id: 'LIST' }],
    }),

    // PATCH /leadership-members/:id (multipart form)
    updateLeadershipMember: builder.mutation<
      LeadershipMember,
      UpdateLeadershipMemberPayload
    >({
      query: ({ id, ...payload }) => {
        const formData = new FormData();
        if (payload.name) formData.append('name', payload.name);
        if (payload.designation)
          formData.append('designation', payload.designation);
        if (payload.bio !== undefined) formData.append('bio', payload.bio ?? '');
        if (payload.email !== undefined)
          formData.append('email', payload.email ?? '');
        if (payload.website_url !== undefined)
          formData.append('website_url', payload.website_url ?? '');
        if (payload.twitter_url !== undefined)
          formData.append('twitter_url', payload.twitter_url ?? '');
        if (payload.linkedin_url !== undefined)
          formData.append('linkedin_url', payload.linkedin_url ?? '');
        if (payload.facebook_url !== undefined)
          formData.append('facebook_url', payload.facebook_url ?? '');
        if (payload.instagram_url !== undefined)
          formData.append('instagram_url', payload.instagram_url ?? '');
        if (payload.display_order !== undefined)
          formData.append('display_order', String(payload.display_order));
        if (payload.is_active !== undefined)
          formData.append('is_active', String(payload.is_active));
        if (payload.user_id !== undefined)
          formData.append('user_id', payload.user_id ?? '');
        if (payload.photo) formData.append('photo', payload.photo);

        return {
          url: `/leadership-members/${id}`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Leadership', id },
        { type: 'Leadership', id: 'LIST' },
      ],
    }),

    // PATCH /leadership-members/reorder
    reorderLeadershipMembers: builder.mutation<
      { message: string },
      string[]
    >({
      query: (ids) => ({
        url: '/leadership-members/reorder',
        method: 'PATCH',
        body: { ids },
      }),
      invalidatesTags: [{ type: 'Leadership', id: 'LIST' }],
    }),

    // DELETE /leadership-members/:id
    deleteLeadershipMember: builder.mutation<void, string>({
      query: (id) => ({
        url: `/leadership-members/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Leadership', id },
        { type: 'Leadership', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLeadershipMembersQuery,
  useGetLeadershipMemberByIdQuery,
  useCreateLeadershipMemberMutation,
  useUpdateLeadershipMemberMutation,
  useReorderLeadershipMembersMutation,
  useDeleteLeadershipMemberMutation,
} = leadershipApi;
