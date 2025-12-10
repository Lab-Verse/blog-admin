// src/app/redux/selectors/authorFollowersSelectors.ts

import type { RootState } from '../../store';

export const selectAuthorFollowersState = (state: RootState) =>
  state.authorFollowers;

export const selectAuthorFollowersList = (state: RootState) =>
  state.authorFollowers.list;

export const selectAuthorFollowersTotal = (state: RootState) =>
  state.authorFollowers.total;

export const selectAuthorFollowersPage = (state: RootState) =>
  state.authorFollowers.page;

export const selectAuthorFollowersLimit = (state: RootState) =>
  state.authorFollowers.limit;

export const selectAuthorFollowersLoading = (state: RootState) =>
  state.authorFollowers.isLoading;

export const selectAuthorFollowersError = (state: RootState) =>
  state.authorFollowers.error;

export const selectSelectedFollow = (state: RootState) =>
  state.authorFollowers.selectedFollow;

export const selectIsFollowingCurrentAuthor = (state: RootState) =>
  state.authorFollowers.isFollowingCurrentAuthor;

interface AuthorFollower {
    id: string;
    // Add other properties as needed
}

export const selectFollowById =
    (id: string) =>
    (state: RootState): AuthorFollower | null =>
        state.authorFollowers.list.find((f: AuthorFollower) => f.id === id) ?? null;
