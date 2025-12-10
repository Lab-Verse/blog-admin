import React from 'react';
import { Heart, ThumbsUp, Zap, Smile, Star } from 'lucide-react';

interface ReactionIconProps {
    type: string;
    className?: string;
}

export const ReactionIcon: React.FC<ReactionIconProps> = ({ type, className = 'w-5 h-5' }) => {
    switch (type.toLowerCase()) {
        case 'like':
            return <ThumbsUp className={className} />;
        case 'love':
            return <Heart className={className} />;
        case 'clap':
            return <Zap className={className} />;
        case 'smile':
            return <Smile className={className} />;
        case 'star':
            return <Star className={className} />;
        default:
            return <ThumbsUp className={className} />;
    }
};

export const getReactionColor = (type: string): string => {
    switch (type.toLowerCase()) {
        case 'like':
            return 'text-primary-600 bg-primary-100 hover:bg-primary-200';
        case 'love':
            return 'text-danger-600 bg-danger-100 hover:bg-danger-200';
        case 'clap':
            return 'text-accent-600 bg-accent-100 hover:bg-accent-200';
        case 'smile':
            return 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200';
        case 'star':
            return 'text-purple-600 bg-purple-100 hover:bg-purple-200';
        default:
            return 'text-secondary-600 bg-secondary-100 hover:bg-secondary-200';
    }
};
