'use client';

import CommentsPageComponent from '@/components/comments/pages/CommentsPageComponent';
import { useGetCommentsQuery, useUpdateCommentMutation, useDeleteCommentMutation } from '@/redux/api/comment/commentsApi';
import { CommentStatus } from '@/redux/types/comment/comments.types';

export default function CommentsPage() {
  const { data, isLoading } = useGetCommentsQuery(undefined, {
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
    <CommentsPageComponent
      comments={data?.items || []}
      isLoading={isLoading}
      onUpdateStatus={handleUpdateStatus}
      onDelete={handleDelete}
    />
  );
}