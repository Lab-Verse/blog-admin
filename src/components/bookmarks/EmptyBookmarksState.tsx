import React from 'react';
import { BookmarkX, Sparkles } from 'lucide-react';

export const EmptyBookmarksState: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 fade-in">
            {/* Icon with Gradient Background */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-linear-to-br from-primary-400 to-accent-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                <div className="relative bg-linear-to-br from-primary-500 to-accent-500 p-6 rounded-full">
                    <BookmarkX className="w-16 h-16 text-white" strokeWidth={1.5} />
                </div>
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold text-secondary-900 mb-3 text-center">
                No Bookmarks Yet
            </h2>

            {/* Description */}
            <p className="text-secondary-600 text-center max-w-md mb-8 leading-relaxed">
                Start building your collection of favorite posts. Bookmark articles you want to read later or keep for reference.
            </p>

            {/* Decorative Elements */}
            <div className="flex items-center gap-2 text-sm text-secondary-500">
                <Sparkles className="w-4 h-4 text-accent-500" />
                <span>Your bookmarked posts will appear here</span>
                <Sparkles className="w-4 h-4 text-accent-500" />
            </div>

            {/* Optional CTA Button */}
            <button className="mt-8 px-6 py-3 bg-linear-to-r from-primary-600 to-primary-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Explore Posts
            </button>
        </div>
    );
};
