'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CommentReplyStatus } from '@/redux/types/commentreplies/commentReplies.types';

interface CommentRepliesFiltersProps {
  commentId: string;
  setCommentId: (value: string) => void;
  authorId: string;
  setAuthorId: (value: string) => void;
  status: CommentReplyStatus | 'all';
  setStatus: (value: CommentReplyStatus | 'all') => void;
  search: string;
  setSearch: (value: string) => void;
}

export default function CommentRepliesFilters({
  commentId,
  setCommentId,
  authorId,
  setAuthorId,
  status,
  setStatus,
  search,
  setSearch,
}: CommentRepliesFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="commentId">Comment ID</Label>
        <Input
          id="commentId"
          type="text"
          placeholder="Enter comment ID"
          value={commentId}
          onChange={(e) => setCommentId(e.target.value)}
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
          onChange={(e) => setStatus(e.target.value as CommentReplyStatus | 'all')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">All</option>
          <option value={CommentReplyStatus.VISIBLE}>Visible</option>
          <option value={CommentReplyStatus.HIDDEN}>Hidden</option>
          <option value={CommentReplyStatus.DELETED}>Deleted</option>
        </select>
      </div>
      <div className="md:col-span-2 lg:col-span-1">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          type="text"
          placeholder="Search replies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
}