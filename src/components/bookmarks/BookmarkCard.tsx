import React from 'react';
import Image from 'next/image';
import { Bookmark } from '@/redux/types/bookmark/bookmarks.types';
import { Trash2, ExternalLink, Calendar, BookmarkIcon } from 'lucide-react';

interface BookmarkCardProps {
    bookmark: Bookmark;
    onDelete: (id: string) => void;
    onClick: (bookmark: Bookmark) => void;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({
    bookmark,
    onDelete,
    onClick,
}) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to remove this bookmark?')) {
            onDelete(bookmark.id);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const defaultImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80';

    return (
        <div
            onClick={() => onClick(bookmark)}
            className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer card-hover fade-in"
        >
            {/* Cover Image with Gradient Overlay */}
            <div className="relative h-48 overflow-hidden bg-linear-to-br from-primary-400 to-accent-500">
                <Image
                    src={bookmark.post?.cover_image_url || defaultImage}
                    alt={bookmark.post?.title || 'Bookmark'}
                    width={400}
                    height={192}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.currentTarget.src = defaultImage;
                    }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Delete Button */}
                <button
                    onClick={handleDelete}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-danger-500 hover:text-white transform hover:scale-110"
                    aria-label="Delete bookmark"
                >
                    <Trash2 className="w-4 h-4" />
                </button>

                {/* Bookmark Icon Badge */}
                <div className="absolute top-3 left-3 p-2 bg-accent-500 rounded-lg shadow-lg">
                    <BookmarkIcon className="w-4 h-4 text-white fill-white" />
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Title */}
                <h3 className="text-lg font-bold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
                    {bookmark.post?.title || 'Untitled Post'}
                </h3>

                {/* Excerpt */}
                {bookmark.post?.excerpt && (
                    <p className="text-sm text-secondary-600 mb-4 line-clamp-3">
                        {bookmark.post.excerpt}
                    </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                    <div className="flex items-center gap-2 text-xs text-secondary-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(bookmark.created_at)}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>View Details</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                </div>
            </div>

            {/* Glassmorphism Hover Effect */}
            <div className="absolute inset-0 bg-linear-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
    );
};
