'use client';

import React from 'react';

interface CategoryStatusBadgeProps {
    isActive: boolean;
}

export default function CategoryStatusBadge({ isActive }: CategoryStatusBadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${isActive
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
        >
            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );
}
