import React from 'react';
import { Reaction } from '@/redux/types/reaction/reactions.types';
import { ReactionButton } from './ReactionButton';

interface ReactionsBarProps {
    reactions: Reaction[];
    currentUserId: string;
    targetType: string;
    targetId: string;
    onReact: (reactionType: string) => void;
    onUnreact: (reactionId: string) => void;
    isLoading?: boolean;
}

const AVAILABLE_REACTIONS = ['like', 'love', 'clap', 'smile', 'star'];

export const ReactionsBar: React.FC<ReactionsBarProps> = ({
    reactions,
    currentUserId,
    targetType,
    targetId,
    onReact,
    onUnreact,
    isLoading = false,
}) => {
    // Calculate counts for each reaction type
    const reactionCounts: Record<string, number> = {};
    reactions.forEach((r) => {
        reactionCounts[r.reaction_type] = (reactionCounts[r.reaction_type] || 0) + 1;
    });

    // Find user's current reaction
    const userReaction = reactions.find((r) => r.user_id === currentUserId);

    const handleReactionClick = (reactionType: string) => {
        if (isLoading) return;

        if (userReaction) {
            if (userReaction.reaction_type === reactionType) {
                // Same reaction - remove it
                onUnreact(userReaction.id);
            } else {
                // Different reaction - this would require update, but for simplicity we'll remove and add
                onUnreact(userReaction.id);
                setTimeout(() => onReact(reactionType), 100);
            }
        } else {
            // No reaction yet - add it
            onReact(reactionType);
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {AVAILABLE_REACTIONS.map((reactionType) => (
                <ReactionButton
                    key={reactionType}
                    reactionType={reactionType}
                    count={reactionCounts[reactionType] || 0}
                    isActive={userReaction?.reaction_type === reactionType}
                    onClick={() => handleReactionClick(reactionType)}
                    disabled={isLoading}
                />
            ))}
        </div>
    );
};
