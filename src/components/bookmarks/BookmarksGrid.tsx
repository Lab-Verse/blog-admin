import React from 'react';
import { BookmarkCard } from './BookmarkCard';
import { Bookmark } from '@/redux/types/bookmark/bookmarks.types';

interface BookmarksGridProps {
    bookmarks: Bookmark[];
    onDelete: (id: string) => void;
    onCardClick: (bookmark: Bookmark) => void;
}

export const BookmarksGrid: React.FC<BookmarksGridProps> = ({
    bookmarks,
    onDelete,
    onCardClick,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
                <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onDelete={onDelete}
                    onClick={onCardClick}
                />
            ))}
        </div>
    );
};
