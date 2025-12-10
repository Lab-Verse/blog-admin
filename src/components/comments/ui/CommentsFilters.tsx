'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CommentStatus } from '@/redux/types/comment/comments.types';

interface CommentsFiltersProps {
  postId: string;
  setPostId: (value: string) => void;
  authorId: string;
  setAuthorId: (value: string) => void;
  status: CommentStatus | 'all';
  setStatus: (value: CommentStatus | 'all') => void;
  search: string;
  setSearch: (value: string) => void;
}

export default function CommentsFilters({
  postId,
  setPostId,
  authorId,
  setAuthorId,
  status,
  setStatus,
  search,
  setSearch,
}: CommentsFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="postId">Post ID</Label>
        <Input
          id="postId"
          type="text"
          placeholder="Enter post ID"
          value={postId}
          onChange={(e) => setPostId(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="authorId">Author ID</Label>
        <Input
          id="authorId"
          type="text"
          placeholder="Enter author ID"
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as CommentStatus | 'all')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">All</option>
          <option value={CommentStatus.VISIBLE}>Visible</option>
          <option value={CommentStatus.HIDDEN}>Hidden</option>
          <option value={CommentStatus.DELETED}>Deleted</option>
        </select>
      </div>
      <div className="md:col-span-2 lg:col-span-1">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          type="text"
          placeholder="Search comments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
}