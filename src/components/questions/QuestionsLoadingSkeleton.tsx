import React from 'react';

interface QuestionsLoadingSkeletonProps {
    count?: number;
}

export const QuestionsLoadingSkeleton: React.FC<QuestionsLoadingSkeletonProps> = ({
    count = 6,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl shadow-md p-6 animate-pulse"
                >
                    {/* Badges */}
                    <div className="flex gap-2 mb-4">
                        <div className="h-6 w-16 bg-secondary-200 rounded-full shimmer" />
                        <div className="h-6 w-20 bg-secondary-200 rounded-full shimmer" />
                    </div>

                    {/* Title */}
                    <div className="space-y-2 mb-3">
                        <div className="h-6 bg-secondary-200 rounded shimmer w-3/4" />
                        <div className="h-6 bg-secondary-200 rounded shimmer w-1/2" />
                    </div>

                    {/* Content */}
                    <div className="space-y-2 mb-4">
                        <div className="h-3 bg-secondary-100 rounded shimmer w-full" />
                        <div className="h-3 bg-secondary-100 rounded shimmer w-5/6" />
                        <div className="h-3 bg-secondary-100 rounded shimmer w-4/6" />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                        <div className="flex gap-4">
                            <div className="h-3 bg-secondary-200 rounded shimmer w-20" />
                            <div className="h-3 bg-secondary-200 rounded shimmer w-24" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
