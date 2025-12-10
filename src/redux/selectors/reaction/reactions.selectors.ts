// src/app/redux/selectors/reactions.selectors.ts

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Reaction, ReactionTargetType } from '../../types/reaction/reactions.types';

export const selectReactionsState = (state: RootState) => state.reactions;

export const selectAllReactions = createSelector(
  [selectReactionsState],
  (s) => s.items,
);

export const selectReactionsLoading = createSelector(
  [selectReactionsState],
  (s) => s.loading,
);

export const selectReactionsError = createSelector(
  [selectReactionsState],
  (s) => s.error,
);

/** All reactions for a specific target (e.g. one post, question, comment) */
export const makeSelectReactionsForTarget = (
  targetType: ReactionTargetType,
  targetId: string,
) =>
  createSelector([selectAllReactions], (items) =>
    items.filter((r) => {
      if (r.target_type !== targetType) return false;

      // match correct id field based on type
      switch (targetType) {
        case 'post':
          return r.post_id === targetId;
        case 'question':
          return r.question_id === targetId;
        case 'comment':
          return r.comment_id === targetId;
        case 'answer':
          return r.answer_id === targetId;
        default:
          return false;
      }
    }),
  );

/** Count reactions by type for a target (e.g. like=10, love=3) */
export const makeSelectReactionCountsForTarget = (
  targetType: ReactionTargetType,
  targetId: string,
) =>
  createSelector(
    [makeSelectReactionsForTarget(targetType, targetId)],
    (reactions) => {
      const counts: Record<string, number> = {};
      reactions.forEach((r) => {
        counts[r.reaction_type] = (counts[r.reaction_type] || 0) + 1;
      });
      return counts;
    },
  );

/** Check if a given user reacted with a given type on a target */
export const makeSelectUserReactionForTarget = (
  targetType: ReactionTargetType,
  targetId: string,
  userId: string,
) =>
  createSelector(
    [makeSelectReactionsForTarget(targetType, targetId)],
    (reactions): Reaction | undefined =>
      reactions.find((r) => r.user_id === userId),
  );
