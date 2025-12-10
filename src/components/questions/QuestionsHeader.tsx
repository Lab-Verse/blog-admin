import React from 'react';
import { Search, Filter, MessageSquare, Plus } from 'lucide-react';
import { QuestionStatus } from '@/redux/types/question/questions.types';

interface QuestionsHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter: QuestionStatus | 'all';
    onStatusFilterChange: (status: QuestionStatus | 'all') => void;
    totalCount: number;
    onCreateQuestion: () => void;
}

export const QuestionsHeader: React.FC<QuestionsHeaderProps> = ({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    totalCount,
    onCreateQuestion,
}) => {
    return (
        <div className="mb-8 space-y-6 fade-in">
            {/* Title Section */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-linear-to-br from-accent-500 to-primary-500 rounded-xl shadow-lg">
                        <MessageSquare className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gradient-accent">
                            Questions
                        </h1>
                        <p className="text-secondary-600 mt-1">
                            {totalCount} {totalCount === 1 ? 'question' : 'questions'} in total
                        </p>
                    </div>
                </div>

                {/* Create Button */}
                <button
                    onClick={onCreateQuestion}
                    className="flex items-center gap-2 px-5 py-3 bg-linear-to-r from-accent-600 to-primary-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Question</span>
                </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input
                        type="text"
                        placeholder="Search questions by title or content..."
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
                        onChange={(e) => onStatusFilterChange(e.target.value as QuestionStatus | 'all')}
                        className="pl-12 pr-10 py-3.5 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer appearance-none min-w-[180px]"
                    >
                        <option value="all">All Statuses</option>
                        <option value={QuestionStatus.OPEN}>Open</option>
                        <option value={QuestionStatus.CLOSED}>Closed</option>
                        <option value={QuestionStatus.ARCHIVED}>Archived</option>
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
