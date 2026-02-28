'use client';

import { useState } from 'react';
import PostsPageComponent from '@/components/posts/pages/PostsPageComponent';
import { useGetPostsQuery, useDeletePostMutation, useApprovePostMutation, useRejectPostMutation } from '@/redux/api/post/posts.api';
import { Post } from '@/redux/types/post/posts.types';
import { useRouter } from 'next/navigation';

export default function PostsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data: postsData, isLoading } = useGetPostsQuery({ page, limit }, {
    pollingInterval: 30000, // Real-time: Refresh every 30 seconds
    refetchOnMountOrArgChange: true,
  });
  const [deletePost] = useDeletePostMutation();
  const [approvePost] = useApprovePostMutation();
  const [rejectPost] = useRejectPostMutation();

  const handleAdd = () => {
    router.push('/posts/create');
  };

  const handleEdit = (post: Post) => {
    router.push(`/posts/${post.id}/edit`);
  };

  const handleDelete = async (post: Post) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost(post.id);
    }
  };

  const handleApprove = async (post: Post) => {
    if (confirm(`Approve "${post.title}" for publishing?`)) {
      await approvePost(post.id);
    }
  };

  const handleReject = async (post: Post) => {
    const reason = prompt('Enter rejection reason (optional):');
    if (reason !== null) {
      await rejectPost({ id: post.id, reason: reason || undefined });
    }
  };

  const totalPages = postsData ? Math.ceil(postsData.total / limit) : 1;

  return (
    <PostsPageComponent
      posts={postsData?.data || []}
      isLoading={isLoading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onApprove={handleApprove}
      onReject={handleReject}
      currentPage={page}
      onPageChange={setPage}
      totalPages={totalPages}
    />
  );
}