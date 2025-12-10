'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Bookmark } from '@/redux/types/bookmark/bookmarks.types';
import { X, ExternalLink, Trash2, Calendar, BookmarkIcon } from 'lucide-react';

interface BookmarkDetailModalProps {
    bookmark: Bookmark | null;
    isOpen: boolean;
    onClose: () => void;
    onDelete: (id: string) => void;
}

export const BookmarkDetailModal: React.FC<BookmarkDetailModalProps> = ({
    bookmark,
    isOpen,
    onClose,
    onDelete,
}) => {
    const router = useRouter();
    // Close on ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !bookmark) return null;

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to remove this bookmark?')) {
            onDelete(bookmark.id);
            onClose();
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const defaultImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scale-in">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-danger-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Cover Image */}
                <div className="relative h-64 md:h-80 overflow-hidden bg-linear-to-br from-primary-400 to-accent-500">
                    <Image
                        src={bookmark.post?.cover_image_url || defaultImage}
                        alt={bookmark.post?.title || 'Bookmark'}
                        width={800}
                        height={320}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = defaultImage;
                        }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                    {/* Bookmark Badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                        <BookmarkIcon className="w-4 h-4 text-accent-600 fill-accent-600" />
                        <span className="text-sm font-semibold text-secondary-900">Bookmarked</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4 leading-tight">
                        {bookmark.post?.title || 'Untitled Post'}
                    </h2>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-secondary-600 mb-6">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Bookmarked on {formatDate(bookmark.created_at)}</span>
                    </div>

                    {/* Excerpt */}
                    {bookmark.post?.excerpt && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-secondary-800 mb-3">Description</h3>
                            <p className="text-secondary-700 leading-relaxed">
                                {bookmark.post.excerpt}
                            </p>
                        </div>
                    )}

                    {/* Post Slug */}
                    {bookmark.post?.slug && (
                        <div className="mb-8 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                            <h3 className="text-sm font-semibold text-secondary-700 mb-1">Post Slug</h3>
                            <code className="text-sm text-primary-600 font-mono">
                                /{bookmark.post.slug}
                            </code>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-secondary-200">
                        <button
                            onClick={() => {
                                // Navigate to post - adjust URL as needed
                                router.push(`/posts/${bookmark.post?.slug || bookmark.post_id}`);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-primary-600 to-primary-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            <ExternalLink className="w-5 h-5" />
                            <span>View Full Post</span>
                        </button>

                        <button
                            onClick={handleDelete}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-danger-500 text-danger-600 font-medium rounded-lg hover:bg-danger-500 hover:text-white transition-all duration-300"
                        >
                            <Trash2 className="w-5 h-5" />
                            <span>Remove Bookmark</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
