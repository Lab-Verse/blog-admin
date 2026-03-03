'use client';

import { useState } from 'react';
import PostsPageComponent from '@/components/posts/pages/PostsPageComponent';
import {
  useGetPostsQuery,
  useDeletePostMutation,
  useApprovePostMutation,
  useRejectPostMutation,
  useBulkDeletePostsMutation,
  useBulkUpdatePostStatusMutation,
} from '@/redux/api/post/posts.api';
import { Post, PostStatus } from '@/redux/types/post/posts.types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function PostsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const { data: postsData, isLoading } = useGetPostsQuery({ page, limit }, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
  });
  const [deletePost] = useDeletePostMutation();
  const [approvePost] = useApprovePostMutation();
  const [rejectPost] = useRejectPostMutation();
  const [bulkDelete] = useBulkDeletePostsMutation();
  const [bulkUpdateStatus] = useBulkUpdatePostStatusMutation();

  const handleAdd = () => {
    router.push('/posts/create');
  };

  const handleEdit = (post: Post) => {
    router.push(`/posts/${post.id}/edit`);
  };

  const handleDelete = async (post: Post) => {
    try {
      await deletePost(post.id).unwrap();
      toast?.success?.('Post deleted successfully');
    } catch {
      toast?.error?.('Failed to delete post');
    }
  };

  const handleApprove = async (post: Post) => {
    try {
      await approvePost(post.id).unwrap();
      toast?.success?.(`"${post.title}" approved and published`);
    } catch {
      toast?.error?.('Failed to approve post');
    }
  };

  const handleReject = async (post: Post) => {
    // The PostsPageComponent passes the reason via _rejectReason on the post object
    const reason = (post as any)?._rejectReason || undefined;
    try {
      await rejectPost({ id: post.id, reason }).unwrap();
      toast?.success?.(`"${post.title}" rejected`);
    } catch {
      toast?.error?.('Failed to reject post');
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await bulkDelete(ids).unwrap();
      toast?.success?.(`${ids.length} posts deleted`);
    } catch {
      toast?.error?.('Failed to delete some posts');
    }
  };

  const handleBulkPublish = async (ids: string[]) => {
    try {
      await bulkUpdateStatus({ ids, status: PostStatus.PUBLISHED }).unwrap();
      toast?.success?.(`${ids.length} posts published`);
    } catch {
      toast?.error?.('Failed to publish some posts');
    }
  };

  const handleBulkUnpublish = async (ids: string[]) => {
    try {
      await bulkUpdateStatus({ ids, status: PostStatus.DRAFT }).unwrap();
      toast?.success?.(`${ids.length} posts unpublished`);
    } catch {
      toast?.error?.('Failed to unpublish some posts');
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
      onBulkDelete={handleBulkDelete}
      onBulkPublish={handleBulkPublish}
      onBulkUnpublish={handleBulkUnpublish}
      currentPage={page}
      onPageChange={setPage}
      totalPages={totalPages}
    />
  );
}