import React from 'react';
import { Tag } from 'lucide-react';

interface CategoryBadgeProps {
    categoryName?: string;
    className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ categoryName, className = '' }) => {
    if (!categoryName) return null;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-300 ${className}`}
        >
            <Tag className="w-3 h-3" />
            {categoryName}
        </span>
    );
};
