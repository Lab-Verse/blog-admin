'use client';

import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useGetUserBookmarksQuery, useDeleteBookmarkMutation } from '@/redux/api/bookmark/bookmarksApi';
import {
    selectBookmarksList,
    selectBookmarksLoading,
    selectBookmarksError,
} from '@/redux/selectors/bookmark/bookmarksSelectors';
import { Bookmark } from '@/redux/types/bookmark/bookmarks.types';
import { BookmarksHeader } from '../BookmarksHeader';
import { BookmarksGrid } from '../BookmarksGrid';
import { EmptyBookmarksState } from '../EmptyBookmarksState';
import { BookmarksLoadingSkeleton } from '../BookmarksLoadingSkeleton';
import { BookmarkDetailModal } from '../BookmarkDetailModal';
import { Bookmark as BookmarkIcon, TrendingUp, Clock, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface BookmarksPageProps {
    userId: string;
}

// Mock data for fallback
const MOCK_BOOKMARKS: Bookmark[] = [
    {
        id: '1',
        user_id: 'user-1',
        post_id: 'post-1',
        created_at: new Date().toISOString(),
        post: {
            id: 'post-1',
            title: 'The Future of React Server Components',
            excerpt: 'Exploring the benefits and trade-offs of RSC in modern web development.',
            cover_image_url: 'https://picsum.photos/seed/react/800/400'
        }
    },
    {
        id: '2',
        user_id: 'user-1',
        post_id: 'post-2',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        post: {
            id: 'post-2',
            title: 'Mastering TypeScript Generics',
            excerpt: 'A deep dive into advanced TypeScript generic patterns.',
            cover_image_url: 'https://picsum.photos/seed/ts/800/400'
        }
    },
    {
        id: '3',
        user_id: 'user-1',
        post_id: 'post-3',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        post: {
            id: 'post-3',
            title: 'Tailwind CSS Best Practices',
            excerpt: 'How to organize and scale your Tailwind CSS projects.',
            cover_image_url: 'https://picsum.photos/seed/tailwind/800/400'
        }
    },
    {
        id: '4',
        user_id: 'user-1',
        post_id: 'post-4',
        created_at: new Date(Date.now() - 604800000).toISOString(),
        post: {
            id: 'post-4',
            title: 'Next.js 14 Routing Guide',
            excerpt: 'Understanding the App Router and new routing paradigms.',
            cover_image_url: 'https://picsum.photos/seed/next/800/400'
        }
    },
    {
        id: '5',
        user_id: 'user-1',
        post_id: 'post-5',
        created_at: new Date(Date.now() - 1209600000).toISOString(),
        post: {
            id: 'post-5',
            title: 'Web Accessibility Checklist',
            excerpt: 'Ensure your website is accessible to everyone.',
            cover_image_url: 'https://picsum.photos/seed/a11y/800/400'
        }
    }
];

export const BookmarksPage: React.FC<BookmarksPageProps> = ({ userId }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');
    const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { isLoading: isFetching } = useGetUserBookmarksQuery({ userId });
    const rawBookmarks = useSelector(selectBookmarksList);
    const isLoading = useSelector(selectBookmarksLoading);
    const error = useSelector(selectBookmarksError);
    const [deleteBookmark, { isLoading: isDeleting }] = useDeleteBookmarkMutation();

    // Use mock data if there's an error or no data
    const bookmarks = error ? MOCK_BOOKMARKS : rawBookmarks;
    const isDemoMode = !!error;

    const filteredAndSortedBookmarks = useMemo(() => {
        let result = [...bookmarks];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((bookmark) => {
                const title = bookmark.post?.title?.toLowerCase() || '';
                const excerpt = bookmark.post?.excerpt?.toLowerCase() || '';
                return title.includes(query) || excerpt.includes(query);
            });
        }

        result.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [bookmarks, searchQuery, sortOrder]);

    const handleDelete = async (id: string) => {
        if (isDemoMode) {
            alert('Delete functionality is disabled in demo mode.');
            return;
        }
        try {
            await deleteBookmark(id).unwrap();
        } catch (err) {
            console.error('Failed to delete bookmark:', err);
            alert('Failed to delete bookmark. Please try again.');
        }
    };

    const handleCardClick = (bookmark: Bookmark) => {
        setSelectedBookmark(bookmark);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBookmark(null);
    };

    // Calculate stats
    const thisWeekCount = bookmarks.filter(b => {
        const created = new Date(b.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return created >= weekAgo;
    }).length;

    if (isLoading || isFetching) {
        return (
            <div className="p-6">
                <div className="mb-8">
                    <div className="h-12 w-64 bg-secondary-200 rounded shimmer mb-4" />
                    <div className="h-10 w-full max-w-2xl bg-secondary-200 rounded shimmer" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-secondary-200 rounded-xl shimmer" />
                    ))}
                </div>
                <BookmarksLoadingSkeleton count={6} />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Demo Mode Alert */}
            {isDemoMode && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5" />
                    <p className="text-sm font-medium">
                        Showing demo data because the backend is unreachable.
                    </p>
                </div>
            )}

            {/* Header with Gradient Title */}
            <div className="mb-8 fade-in">
                <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Bookmarks</h1>
                    <div className="flex items-center gap-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        Live
                    </div>
                </div>
                <p className="text-secondary-600">
                    Save and organize your favorite content
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Bookmarks</p>
                                <p className="text-3xl font-bold text-secondary-900">{bookmarks.length}</p>
                            </div>
                            <div className="p-3 rounded-full bg-blue-500 text-white">
                                <BookmarkIcon className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">This Week</p>
                                <p className="text-3xl font-bold text-secondary-900">{thisWeekCount}</p>
                            </div>
                            <div className="p-3 rounded-full bg-green-500 text-white">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Sorted By</p>
                                <p className="text-xl font-bold text-secondary-900 capitalize">{sortOrder}</p>
                            </div>
                            <div className="p-3 rounded-full bg-purple-500 text-white">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <BookmarksHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
                totalCount={bookmarks.length}
            />

            {/* Content */}
            {filteredAndSortedBookmarks.length === 0 ? (
                bookmarks.length === 0 ? (
                    <EmptyBookmarksState />
                ) : (
                    <div className="text-center py-16 fade-in">
                        <p className="text-secondary-600 text-lg">
                            No bookmarks match your search criteria.
                        </p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
                        >
                            Clear search
                        </button>
                    </div>
                )
            ) : (
                <BookmarksGrid
                    bookmarks={filteredAndSortedBookmarks}
                    onDelete={handleDelete}
                    onCardClick={handleCardClick}
                />
            )}

            {/* Detail Modal */}
            <BookmarkDetailModal
                bookmark={selectedBookmark}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onDelete={handleDelete}
            />

            {/* Deleting Overlay */}
            {isDeleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-6 flex items-center gap-4">
                        <div className="w-6 h-6 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-secondary-900 font-medium">Removing bookmark...</span>
                    </div>
                </div>
            )}
        </div>
    );
};
