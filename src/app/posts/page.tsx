'use client';

import { useState } from 'react';
import PostsPageComponent from '@/components/posts/pages/PostsPageComponent';
import { useGetPostsQuery, useDeletePostMutation } from '@/redux/api/post/posts.api';
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

  return (
    <PostsPageComponent
      posts={postsData || []}
      isLoading={isLoading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      currentPage={page}
      onPageChange={setPage}
      totalPages={1}
    />
  );
}