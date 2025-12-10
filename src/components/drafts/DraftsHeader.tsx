import React from 'react';
import { Search, Filter, FileText, Plus } from 'lucide-react';
import { DraftStatus } from '@/redux/types/draft/drafts.types';

interface DraftsHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter: DraftStatus | 'all';
    onStatusFilterChange: (status: DraftStatus | 'all') => void;
    totalCount: number;
    onCreateDraft: () => void;
}

export const DraftsHeader: React.FC<DraftsHeaderProps> = ({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    totalCount,
    onCreateDraft,
}) => {
    return (
        <div className="mb-8 space-y-6 fade-in">
            {/* Title Section */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-linear-to-br from-primary-500 to-purple-500 rounded-xl shadow-lg">
                        <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gradient-accent">
                            My Drafts
                        </h1>
                        <p className="text-secondary-600 mt-1">
                            {totalCount} {totalCount === 1 ? 'draft' : 'drafts'} in total
                        </p>
                    </div>
                </div>

                {/* Create Button */}
                <button
                    onClick={onCreateDraft}
                    className="flex items-center gap-2 px-5 py-3 bg-linear-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Draft</span>
                </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input
                        type="text"
                        placeholder="Search drafts by title or content..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                    />
                </div>

                {/* Status Filter Dropdown */}
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusFilterChange(e.target.value as DraftStatus | 'all')}
                        className="pl-12 pr-10 py-3.5 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer appearance-none min-w-[180px]"
                    >
                        <option value="all">All Statuses</option>
                        <option value={DraftStatus.DRAFT}>Draft</option>
                        <option value={DraftStatus.SCHEDULED}>Scheduled</option>
                        <option value={DraftStatus.ARCHIVED}>Archived</option>
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
