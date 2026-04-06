'use client';

import { useState, useCallback } from 'react';
import PostsPageComponent from '@/components/posts/pages/PostsPageComponent';
import {
  useGetPostsQuery,
  useDeletePostMutation,
  useApprovePostMutation,
  useRejectPostMutation,
  useBulkDeletePostsMutation,
  useBulkUpdatePostStatusMutation,
} from '@/redux/api/post/posts.api';
import { useGetCategoriesQuery } from '@/redux/api/category/categoriesApi';
import { useGetTagsQuery } from '@/redux/api/tags/tagsApi';
import { useGetUsersQuery } from '@/redux/api/user/usersApi';
import { Post, PostStatus, PostType } from '@/redux/types/post/posts.types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function PostsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [postTypeFilter, setPostTypeFilter] = useState<PostType | 'all'>('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data: postsData, isLoading, isFetching } = useGetPostsQuery({
    page,
    limit,
    search: search || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    category_id: categoryFilter || undefined,
    post_type: postTypeFilter !== 'all' ? postTypeFilter : undefined,
    author: authorFilter || undefined,
    sortBy,
    sortOrder,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  }, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
  });

  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: tagsData } = useGetTagsQuery();
  const { data: usersData } = useGetUsersQuery({ limit: 100 });
  const [deletePost] = useDeletePostMutation();
  const [approvePost] = useApprovePostMutation();
  const [rejectPost] = useRejectPostMutation();
  const [bulkDelete] = useBulkDeletePostsMutation();
  const [bulkUpdateStatus] = useBulkUpdatePostStatusMutation();

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleStatusFilter = useCallback((value: PostStatus | 'all') => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const handleCategoryFilter = useCallback((value: string) => {
    setCategoryFilter(value);
    setPage(1);
  }, []);

  const handleAuthorFilter = useCallback((value: string) => {
    setAuthorFilter(value);
    setPage(1);
  }, []);

  const handlePostTypeFilter = useCallback((value: PostType | 'all') => {
    setPostTypeFilter(value);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((field: string, order: 'ASC' | 'DESC') => {
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  }, []);

  const handleDateFromChange = useCallback((value: string) => {
    setDateFrom(value);
    setPage(1);
  }, []);

  const handleDateToChange = useCallback((value: string) => {
    setDateTo(value);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('all');
    setCategoryFilter('');
    setAuthorFilter('');
    setPostTypeFilter('all');
    setSortBy('created_at');
    setSortOrder('DESC');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  }, []);

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
  const categories = categoriesData?.items || [];
  const users = usersData?.items || [];

  return (
    <PostsPageComponent
      posts={postsData?.data || []}
      isLoading={isLoading}
      isFetching={isFetching}
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
      totalPosts={postsData?.total || 0}
      search={search}
      onSearchChange={handleSearch}
      statusFilter={statusFilter}
      onStatusFilterChange={handleStatusFilter}
      categoryFilter={categoryFilter}
      onCategoryFilterChange={handleCategoryFilter}
      authorFilter={authorFilter}
      onAuthorFilterChange={handleAuthorFilter}
      postTypeFilter={postTypeFilter}
      onPostTypeFilterChange={handlePostTypeFilter}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSortChange={handleSortChange}
      dateFrom={dateFrom}
      dateTo={dateTo}
      onDateFromChange={handleDateFromChange}
      onDateToChange={handleDateToChange}
      onClearFilters={handleClearFilters}
      categories={categories}
      users={users}
    />
  );
}
