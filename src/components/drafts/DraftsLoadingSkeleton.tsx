import React from 'react';

interface DraftsLoadingSkeletonProps {
    count?: number;
}

export const DraftsLoadingSkeleton: React.FC<DraftsLoadingSkeletonProps> = ({
    count = 6,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse"
                >
                    {/* Image Skeleton */}
                    <div className="h-48 bg-secondary-200 shimmer relative">
                        {/* Status badge skeleton */}
                        <div className="absolute top-3 left-3 h-6 w-20 bg-secondary-300 rounded-full shimmer" />
                    </div>

                    {/* Content Skeleton */}
                    <div className="p-5 space-y-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <div className="h-5 bg-secondary-200 rounded shimmer w-3/4" />
                            <div className="h-5 bg-secondary-200 rounded shimmer w-1/2" />
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-2">
                            <div className="h-3 bg-secondary-100 rounded shimmer w-full" />
                            <div className="h-3 bg-secondary-100 rounded shimmer w-5/6" />
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                            <div className="flex gap-4">
                                <div className="h-3 bg-secondary-200 rounded shimmer w-20" />
                                <div className="h-3 bg-secondary-200 rounded shimmer w-16" />
                            </div>
                            <div className="h-3 bg-secondary-200 rounded shimmer w-12" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
