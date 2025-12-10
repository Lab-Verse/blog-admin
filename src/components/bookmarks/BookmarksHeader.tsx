import React from 'react';
import { Search, Filter, BookmarkIcon } from 'lucide-react';

interface BookmarksHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortOrder: 'recent' | 'oldest';
    onSortChange: (order: 'recent' | 'oldest') => void;
    totalCount: number;
}

export const BookmarksHeader: React.FC<BookmarksHeaderProps> = ({
    searchQuery,
    onSearchChange,
    sortOrder,
    onSortChange,
    totalCount,
}) => {
    return (
        <div className="mb-8 space-y-6 fade-in">
            {/* Title Section */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-linear-to-br from-primary-500 to-accent-500 rounded-xl shadow-lg">
                        <BookmarkIcon className="w-7 h-7 text-white fill-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gradient-accent">
                            My Bookmarks
                        </h1>
                        <p className="text-secondary-600 mt-1">
                            {totalCount} {totalCount === 1 ? 'bookmark' : 'bookmarks'} saved
                        </p>
                    </div>
                </div>

                {/* Count Badge */}
                <div className="px-4 py-2 bg-linear-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-full">
                    <span className="text-sm font-semibold text-primary-700">
                        {totalCount} Total
                    </span>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input
                        type="text"
                        placeholder="Search bookmarks by title or content..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                    />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
                    <select
                        value={sortOrder}
                        onChange={(e) => onSortChange(e.target.value as 'recent' | 'oldest')}
                        className="pl-12 pr-10 py-3.5 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer appearance-none min-w-[180px]"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};
