'use client';

import { useState } from 'react';
import { useGetCommentRepliesQuery, useDeleteCommentReplyMutation } from '@/redux/api/commentreplies/commentRepliesApi';
import type { CommentReply as ApiCommentReply } from '@/redux/types/commentreplies/commentReplies.types';
import { useAppSelector } from '@/redux/hooks';
import {
  selectCommentRepliesLoading,
  selectCommentRepliesError,
} from '@/redux/selectors/commentreplies/commentRepliesSelectors';
import { CommentReplyStatus } from '@/redux/types/commentreplies/commentReplies.types';
import type { CommentReply as ComponentCommentReply } from '@/redux/types/commentreplies/commentReplies.types';
import CommentRepliesTable from '@/components/comment-replies/ui/CommentRepliesTable';
import CommentRepliesFilters from '@/components/comment-replies/ui/CommentRepliesFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, AlertTriangle } from 'lucide-react';

export default function CommentRepliesPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [commentId, setCommentId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [status, setStatus] = useState<CommentReplyStatus | 'all'>('all');
  const [search, setSearch] = useState<string>('');

  const query = {
    page,
    limit,
    ...(commentId && { commentId }),
    ...(userId && { userId }),
    ...(status !== 'all' && { isApproved: status === CommentReplyStatus.VISIBLE }),
    ...(search && { search }),
  };

  const { data, isFetching, refetch } = useGetCommentRepliesQuery(query);
  const isLoading = useAppSelector(selectCommentRepliesLoading);
  const error = useAppSelector(selectCommentRepliesError);

  const [deleteCommentReply, { isLoading: isDeleting }] = useDeleteCommentReplyMutation();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleDeleteReply = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this reply?')) {
      try {
        await deleteCommentReply(id).unwrap();
      } catch (err) {
        console.error('Failed to delete reply:', err);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Comment Replies Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and moderate replies to comments across all posts.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filters</CardTitle>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={isFetching}
            >
              {isFetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CommentRepliesFilters
            commentId={commentId}
            setCommentId={setCommentId}
            authorId={userId}
            setAuthorId={setUserId}
            status={status}
            setStatus={setStatus}
            search={search}
            setSearch={setSearch}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Replies List</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {isLoading && !data ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading replies...</span>
            </div>
          ) : data ? (
            <>
              <CommentRepliesTable
                replies={data.items.map((item: ApiCommentReply): ComponentCommentReply => ({
                  id: item.id,
                  commentId: item.commentId,
                  authorId: item.authorId,
                  content: item.content,
                  status: item.status,
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt,
                  author: item.author ? {
                    id: item.author.id,
                    name: item.author.name,
                    avatarUrl: item.author.avatarUrl
                  } : undefined
                }))}
                onDelete={handleDeleteReply}
                isDeleting={isDeleting}
              />
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {data.items.length} of {data.total} replies
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1 || isFetching}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {page} of {Math.ceil(data.total / limit)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= Math.ceil(data.total / limit) || isFetching}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No replies found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}