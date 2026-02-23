'use client';

import CommentsPageComponent from '@/components/comments/pages/CommentsPageComponent';
import { useGetCommentsQuery, useUpdateCommentMutation, useDeleteCommentMutation } from '@/redux/api/comment/commentsApi';
import { CommentStatus } from '@/redux/types/comment/comments.types';

export default function CommentsPage() {
  const { data, isLoading, error } = useGetCommentsQuery(undefined, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
  });

  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const handleUpdateStatus = async (id: string, status: CommentStatus) => {
    await updateComment({ id, data: { status } });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(id);
    }
  };

  return (
    <div>
      {error && (
        <div className="mx-6 mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Failed to load comments. Please check login/session and API connectivity.
        </div>
      )}
      <CommentsPageComponent
        comments={Array.isArray(data) ? data : []}
        isLoading={isLoading}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
      />
    </div>
  );
}