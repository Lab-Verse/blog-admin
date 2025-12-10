import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    isLoading = false,
}) => {
    if (totalPages <= 1) return null;

    const canGoPrevious = currentPage > 1 && !isLoading;
    const canGoNext = currentPage < totalPages && !isLoading;

    return (
        <div className="flex items-center justify-center gap-4 mt-8 fade-in">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!canGoPrevious}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${canGoPrevious
                        ? 'bg-white border border-secondary-200 text-secondary-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 shadow-sm hover:shadow-md'
                        : 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                    }`}
            >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
            </button>

            {/* Page Indicator */}
            <div className="px-6 py-2 bg-linear-to-r from-primary-50 to-purple-50 border border-primary-200 rounded-lg">
                <span className="text-sm font-semibold text-secondary-700">
                    Page <span className="text-primary-600">{currentPage}</span> of{' '}
                    <span className="text-primary-600">{totalPages}</span>
                </span>
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!canGoNext}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${canGoNext
                        ? 'bg-white border border-secondary-200 text-secondary-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 shadow-sm hover:shadow-md'
                        : 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                    }`}
            >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};
