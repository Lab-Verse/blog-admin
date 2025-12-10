// src/app/redux/types/reactions.types.ts

export type ReactionTargetType = 'post' | 'question' | 'comment' | 'answer';

export interface Reaction {
  id: string;

  user_id: string;

  // You might have only one of these or a generic target_id + target_type.
  post_id?: string | null;
  question_id?: string | null;
  comment_id?: string | null;
  answer_id?: string | null;

  target_type: ReactionTargetType; // e.g. 'post', 'question'
  reaction_type: string; // e.g. 'like', 'love', 'clap'

  created_at: string;
  updated_at: string;

  // Optional relations
  user?: {
    id: string;
    name?: string;
    email?: string;
  };
}

/** Create DTO (CreateReactionDto) */
export interface CreateReactionRequest {
  user_id: string;
  target_type: ReactionTargetType;
  target_id: string; // backend can map this to post_id/question_id/etc.
  reaction_type: string;
}

/** Update DTO (UpdateReactionDto = partial) */
export interface UpdateReactionRequest {
  reaction_type?: string;
}

/** Local slice state */
export interface ReactionsState {
  items: Reaction[];
  loading: boolean;
  error: string | null;
}
