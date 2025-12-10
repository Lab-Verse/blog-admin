import React from 'react';
import { ReactionIcon, getReactionColor } from './ReactionIcon';

interface ReactionButtonProps {
    reactionType: string;
    count: number;
    isActive: boolean;
    onClick: () => void;
    disabled?: boolean;
}

export const ReactionButton: React.FC<ReactionButtonProps> = ({
    reactionType,
    count,
    isActive,
    onClick,
    disabled = false,
}) => {
    const colorClass = getReactionColor(reactionType);

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isActive
                    ? colorClass
                    : 'text-secondary-600 bg-secondary-100 hover:bg-secondary-200'
                }`}
        >
            <ReactionIcon type={reactionType} className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
            {count > 0 && <span className="text-sm font-semibold">{count}</span>}
        </button>
    );
};
