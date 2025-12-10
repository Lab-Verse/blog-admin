'use client';

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    useGetReactionsQuery,
    useCreateReactionMutation,
    useDeleteReactionMutation,
} from '@/redux/api/reaction/reactions.api';
import {
    selectAllReactions,
    selectReactionsLoading,
    selectReactionsError,
} from '@/redux/selectors/reaction/reactions.selectors';
import { ReactionTargetType } from '@/redux/types/reaction/reactions.types';
import { ReactionsBar } from '../ReactionsBar';
import { Heart, AlertCircle } from 'lucide-react';

interface ReactionsPageProps {
    userId: string; // Current user ID
    targetType: ReactionTargetType; // e.g., 'post', 'question'
    targetId: string; // ID of the target entity
}

export const ReactionsPage: React.FC<ReactionsPageProps> = ({
    userId,
    targetType,
    targetId,
}) => {
    // Fetch all reactions
    const { isLoading: isFetching } = useGetReactionsQuery();
    const allReactions = useSelector(selectAllReactions);
    const isLoading = useSelector(selectReactionsLoading);
    const error = useSelector(selectReactionsError);

    // Mutations
    const [createReaction, { isLoading: isCreating }] = useCreateReactionMutation();
    const [deleteReaction, { isLoading: isDeleting }] = useDeleteReactionMutation();

    // Filter reactions for this specific target
    const targetReactions = useMemo(() => {
        return allReactions.filter((r) => {
            if (r.target_type !== targetType) return false;

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
        });
    }, [allReactions, targetType, targetId]);

    const handleReact = async (reactionType: string) => {
        try {
            await createReaction({
                user_id: userId,
                target_type: targetType,
                target_id: targetId,
                reaction_type: reactionType,
            }).unwrap();
        } catch (err) {
            console.error('Failed to create reaction:', err);
            alert('Failed to add reaction. Please try again.');
        }
    };

    const handleUnreact = async (reactionId: string) => {
        try {
            await deleteReaction(reactionId).unwrap();
        } catch (err) {
            console.error('Failed to delete reaction:', err);
            alert('Failed to remove reaction. Please try again.');
        }
    };

    if (isLoading || isFetching) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-10 w-20 bg-secondary-200 rounded-lg shimmer" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3 text-danger-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6 fade-in">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-secondary-900">
                    Reactions
                </h3>
                <span className="text-sm text-secondary-500">
                    ({targetReactions.length} total)
                </span>
            </div>

            {/* Reactions Bar */}
            <ReactionsBar
                reactions={targetReactions}
                currentUserId={userId}
                targetType={targetType}
                targetId={targetId}
                onReact={handleReact}
                onUnreact={handleUnreact}
                isLoading={isCreating || isDeleting}
            />

            {/* User Reactions List (Optional) */}
            {targetReactions.length > 0 && (
                <div className="mt-6 pt-6 border-t border-secondary-200">
                    <h4 className="text-sm font-semibold text-secondary-700 mb-3">
                        Recent Reactions
                    </h4>
                    <div className="space-y-2">
                        {targetReactions.slice(0, 5).map((reaction) => (
                            <div
                                key={reaction.id}
                                className="flex items-center justify-between text-sm text-secondary-600"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                        {reaction.user?.name || 'Anonymous'}
                                    </span>
                                    <span>reacted with</span>
                                    <span className="font-semibold text-primary-600">
                                        {reaction.reaction_type}
                                    </span>
                                </div>
                                <span className="text-xs text-secondary-400">
                                    {new Date(reaction.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
