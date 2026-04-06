'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Post, PostStatus, PostType } from '@/redux/types/post/posts.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Plus,
  Check,
  X,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Calendar,
  User,
  FileText,
  ArrowUpDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface UserItem {
  id: string;
  username: string;
  email: string;
  display_name?: string;
}

interface PostsPageComponentProps {
  posts: Post[];
  isLoading: boolean;
  isFetching?: boolean;
  onAdd: () => void;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onApprove?: (post: Post) => void;
  onReject?: (post: Post) => void;
  onBulkDelete?: (ids: string[]) => void;
  onBulkPublish?: (ids: string[]) => void;
  onBulkUnpublish?: (ids: string[]) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  totalPosts: number;
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: PostStatus | 'all';
  onStatusFilterChange: (value: PostStatus | 'all') => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  authorFilter: string;
  onAuthorFilterChange: (value: string) => void;
  postTypeFilter: PostType | 'all';
  onPostTypeFilterChange: (value: PostType | 'all') => void;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  onSortChange: (field: string, order: 'ASC' | 'DESC') => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onClearFilters: () => void;
  categories: Category[];
  users: UserItem[];
}

export default function PostsPageComponent({
  posts,
  isLoading,
  isFetching,
  onAdd,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onBulkDelete,
  onBulkPublish,
  onBulkUnpublish,
  currentPage,
  onPageChange,
  totalPages,
  totalPosts,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  authorFilter,
  onAuthorFilterChange,
  postTypeFilter,
  onPostTypeFilterChange,
  sortBy,
  sortOrder,
  onSortChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
  categories,
  users,
}: PostsPageComponentProps) {
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [postToReject, setPostToReject] = useState<Post | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(search);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleSearchInput = useCallback((value: string) => {
    setLocalSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChange(value);
    }, 400);
  }, [onSearchChange]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const hasActiveFilters =
    search || statusFilter !== 'all' || categoryFilter || authorFilter || postTypeFilter !== 'all' || dateFrom || dateTo;

  const activeFilterCount = [
    search,
    statusFilter !== 'all' ? statusFilter : '',
    categoryFilter,
    authorFilter,
    postTypeFilter !== 'all' ? postTypeFilter : '',
    dateFrom,
    dateTo,
  ].filter(Boolean).length;

  const toggleSelection = (postId: string) => {
    setSelectedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map((p) => p.id));
    }
  };

  const clearSelection = () => setSelectedPosts([]);

  const handleDeleteClick = (post: Post) => {
    setPostToDelete(post);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      onDelete(postToDelete);
      setShowDeleteDialog(false);
      setPostToDelete(null);
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedPosts.length > 0) setShowBulkDeleteDialog(true);
  };

  const confirmBulkDelete = () => {
    onBulkDelete?.(selectedPosts);
    setSelectedPosts([]);
    setShowBulkDeleteDialog(false);
  };

  const handleBulkPublish = () => {
    onBulkPublish?.(selectedPosts);
    setSelectedPosts([]);
  };

  const handleBulkUnpublish = () => {
    onBulkUnpublish?.(selectedPosts);
    setSelectedPosts([]);
  };

  const handleRejectClick = (post: Post) => {
    setPostToReject(post);
    setRejectReason('');
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    if (postToReject && onReject) {
      onReject({ ...postToReject, _rejectReason: rejectReason } as any);
      setShowRejectDialog(false);
      setPostToReject(null);
      setRejectReason('');
    }
  };

  const handleColumnSort = (field: string) => {
    if (sortBy === field) {
      onSortChange(field, sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      onSortChange(field, 'DESC');
    }
  };

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case PostStatus.PUBLISHED:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case PostStatus.PENDING:
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case PostStatus.DRAFT:
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case PostStatus.ARCHIVED:
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusLabel = (status: PostStatus) => {
    switch (status) {
      case PostStatus.PUBLISHED:
        return 'Published';
      case PostStatus.PENDING:
        return 'Pending';
      case PostStatus.DRAFT:
        return 'Draft';
      case PostStatus.ARCHIVED:
        return 'Archived';
      default:
        return status;
    }
  };

  const getPostTypeLabel = (type?: PostType) => {
    switch (type) {
      case PostType.STANDARD:
        return 'Standard';
      case PostType.OPINION:
        return 'Opinion';
      case PostType.VIDEO:
        return 'Video';
      case PostType.AUDIO:
        return 'Audio';
      case PostType.GALLERY:
        return 'Gallery';
      default:
        return 'Standard';
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return <ArrowUpDown className="w-3 h-3 text-slate-300" />;
    return sortOrder === 'ASC' ? (
      <ChevronUp className="w-3 h-3 text-primary-600" />
    ) : (
      <ChevronDown className="w-3 h-3 text-primary-600" />
    );
  };

  const paginationRange = () => {
    const range: (number | string)[] = [];
    const delta = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }
    return range;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 space-y-5">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Posts Management</h1>
            <p className="text-slate-500 mt-1 text-sm">
              {totalPosts > 0 ? `${totalPosts.toLocaleString()} total posts` : 'Manage all posts from every author'}
            </p>
          </div>
          <Button
            onClick={onAdd}
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary-600/20 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              {isFetching && (
                <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-500 w-4 h-4 animate-spin" />
              )}
              <input
                type="text"
                placeholder="Search by title, author, category, tag..."
                value={localSearch}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value as PostStatus | 'all')}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none cursor-pointer min-w-[140px] transition-all"
              >
                <option value="all">All Status</option>
                <option value={PostStatus.PUBLISHED}>Published</option>
                <option value={PostStatus.PENDING}>Pending</option>
                <option value={PostStatus.DRAFT}>Draft</option>
                <option value={PostStatus.ARCHIVED}>Archived</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => onCategoryFilterChange(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none cursor-pointer min-w-[160px] max-w-[200px] transition-all"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                  showAdvancedFilters || activeFilterCount > 1
                    ? 'bg-primary-50 border-primary-200 text-primary-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Advanced</span>
                {activeFilterCount > 1 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-primary-600 text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={onClearFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="border-t border-slate-100 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <User className="w-3.5 h-3.5" />
                    Author
                  </label>
                  <input
                    type="text"
                    placeholder="Search by author name..."
                    value={authorFilter}
                    onChange={(e) => onAuthorFilterChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5" />
                    Post Type
                  </label>
                  <select
                    value={postTypeFilter}
                    onChange={(e) => onPostTypeFilterChange(e.target.value as PostType | 'all')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none cursor-pointer transition-all"
                  >
                    <option value="all">All Types</option>
                    <option value={PostType.STANDARD}>Standard</option>
                    <option value={PostType.OPINION}>Opinion</option>
                    <option value={PostType.VIDEO}>Video</option>
                    <option value={PostType.AUDIO}>Audio</option>
                    <option value={PostType.GALLERY}>Gallery</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => onDateFromChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => onDateToChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Sort by:</span>
                {[
                  { field: 'created_at', label: 'Date Created' },
                  { field: 'updated_at', label: 'Last Updated' },
                  { field: 'title', label: 'Title' },
                  { field: 'views_count', label: 'Views' },
                  { field: 'likes_count', label: 'Likes' },
                ].map(({ field, label }) => (
                  <button
                    key={field}
                    onClick={() => handleColumnSort(field)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      sortBy === field
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {label}
                    <SortIcon field={field} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-400">Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                  <Search className="w-3 h-3" />
                  &ldquo;{search}&rdquo;
                  <button onClick={() => onSearchChange('')} className="ml-0.5 hover:text-blue-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">
                  Status: {getStatusLabel(statusFilter)}
                  <button onClick={() => onStatusFilterChange('all')} className="ml-0.5 hover:text-emerald-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {categoryFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                  <FolderOpen className="w-3 h-3" />
                  {categories.find((c) => c.id === categoryFilter)?.name || 'Category'}
                  <button onClick={() => onCategoryFilterChange('')} className="ml-0.5 hover:text-purple-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {authorFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium">
                  <User className="w-3 h-3" />
                  {authorFilter}
                  <button onClick={() => onAuthorFilterChange('')} className="ml-0.5 hover:text-amber-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {postTypeFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                  <FileText className="w-3 h-3" />
                  {getPostTypeLabel(postTypeFilter)}
                  <button onClick={() => onPostTypeFilterChange('all')} className="ml-0.5 hover:text-indigo-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(dateFrom || dateTo) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-medium">
                  <Calendar className="w-3 h-3" />
                  {dateFrom && dateTo ? `${dateFrom} - ${dateTo}` : dateFrom || `Until ${dateTo}`}
                  <button onClick={() => { onDateFromChange(''); onDateToChange(''); }} className="ml-0.5 hover:text-teal-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3">
            <span className="text-sm font-medium text-primary-700">{selectedPosts.length} selected</span>
            <div className="flex flex-wrap flex-1 gap-2">
              <Button onClick={handleBulkPublish} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg" size="sm">Publish</Button>
              <Button onClick={handleBulkUnpublish} className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1.5 rounded-lg" size="sm">Unpublish</Button>
              <Button onClick={handleBulkDeleteClick} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-lg" size="sm">Delete</Button>
            </div>
            <Button onClick={clearSelection} variant="outline" size="sm" className="text-xs">Clear</Button>
          </div>
        )}

        {/* Posts Table */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            <p className="text-sm text-slate-500">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No posts found</h3>
            <p className="text-sm text-slate-500 mb-4 text-center max-w-md">
              {hasActiveFilters
                ? 'No posts match your current filters. Try adjusting or clearing your filters.'
                : 'Get started by creating your first post.'}
            </p>
            {hasActiveFilters && (
              <Button onClick={onClearFilters} variant="outline" className="text-sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">
            {isFetching && !isLoading && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary-100 overflow-hidden z-10">
                <div className="h-full bg-primary-500 animate-pulse" style={{ width: '100%' }} />
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 md:pl-6 pr-3 text-left w-10">
                      <input
                        type="checkbox"
                        checked={selectedPosts.length === posts.length && posts.length > 0}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700"
                      onClick={() => handleColumnSort('title')}
                    >
                      <span className="inline-flex items-center gap-1">Post <SortIcon field="title" /></span>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Category</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Author</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell cursor-pointer hover:text-slate-700"
                      onClick={() => handleColumnSort('views_count')}
                    >
                      <span className="inline-flex items-center gap-1">Views <SortIcon field="views_count" /></span>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell cursor-pointer hover:text-slate-700"
                      onClick={() => handleColumnSort('created_at')}
                    >
                      <span className="inline-flex items-center gap-1">Date <SortIcon field="created_at" /></span>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider pr-4 md:pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className={`hover:bg-slate-50/80 transition-colors ${selectedPosts.includes(post.id) ? 'bg-primary-50/50' : ''}`}
                    >
                      <td className="whitespace-nowrap py-3.5 pl-4 md:pl-6 pr-3">
                        <input
                          type="checkbox"
                          checked={selectedPosts.includes(post.id)}
                          onChange={() => toggleSelection(post.id)}
                          className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          {post.featured_image && isValidUrl(post.featured_image) ? (
                            <div className="relative h-10 w-14 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                              <Image alt={post.title} src={post.featured_image} className="object-cover" fill sizes="56px" />
                            </div>
                          ) : (
                            <div className="h-10 w-14 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-slate-300" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-medium text-sm text-slate-900 truncate max-w-[250px] lg:max-w-[350px]">{post.title}</div>
                            {post.post_type && post.post_type !== PostType.STANDARD && (
                              <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                                {getPostTypeLabel(post.post_type)}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-3.5 px-3 hidden lg:table-cell">
                        {post.category ? (
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{post.category.name}</span>
                        ) : (
                          <span className="text-xs text-slate-400">--</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap py-3.5 px-3 text-sm text-slate-600 hidden md:table-cell">
                        <span className="truncate max-w-[120px] block">{post.user?.name || post.user?.email || 'Unknown'}</span>
                      </td>
                      <td className="whitespace-nowrap py-3.5 px-3">
                        <Badge className={`${getStatusBadge(post.status)} text-[11px] font-medium border px-2 py-0.5`}>{getStatusLabel(post.status)}</Badge>
                      </td>
                      <td className="whitespace-nowrap py-3.5 px-3 text-sm text-slate-500 hidden sm:table-cell">
                        {(post as any).views_count?.toLocaleString() || '0'}
                      </td>
                      <td className="whitespace-nowrap py-3.5 px-3 text-xs text-slate-500 hidden sm:table-cell">
                        {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="whitespace-nowrap py-3.5 px-3 pr-4 md:pr-6 text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          {post.status === PostStatus.PENDING && onApprove && onReject ? (
                            <>
                              <Button onClick={() => onApprove(post)} variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs h-8 px-2">
                                <Check className="w-3.5 h-3.5 mr-1" /><span className="hidden xl:inline">Approve</span>
                              </Button>
                              <Button onClick={() => handleRejectClick(post)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs h-8 px-2">
                                <X className="w-3.5 h-3.5 mr-1" /><span className="hidden xl:inline">Reject</span>
                              </Button>
                            </>
                          ) : (
                            <>
                              <Link href={`https://twa.com.pk/en/post/${post.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8">
                                <Eye className="w-3.5 h-3.5" />
                              </Link>
                              <Button onClick={() => onEdit(post)} variant="ghost" size="sm" className="text-slate-600 hover:text-primary-600 hover:bg-primary-50 text-xs h-8 px-2">Edit</Button>
                              <Button onClick={() => handleDeleteClick(post)} variant="ghost" size="sm" className="text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs h-8 px-2">
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-sm text-slate-500">
              Page {currentPage} of {totalPages} ({totalPosts.toLocaleString()} results)
            </p>
            <div className="flex items-center gap-1.5">
              <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} variant="outline" size="sm" className="h-9 w-9 p-0 rounded-lg">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {paginationRange().map((item, idx) =>
                item === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 text-sm">...</span>
                ) : (
                  <Button
                    key={item}
                    onClick={() => onPageChange(item as number)}
                    variant={currentPage === item ? 'primary' : 'outline'}
                    className={`w-9 h-9 p-0 rounded-lg text-sm transition-all ${
                      currentPage === item
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item}
                  </Button>
                )
              )}
              <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} variant="outline" size="sm" className="h-9 w-9 p-0 rounded-lg">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteDialog(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Post</h3>
            <p className="text-sm text-slate-600 mb-6">Are you sure you want to delete &ldquo;{postToDelete?.title}&rdquo;? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
              <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Dialog */}
      {showBulkDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowBulkDeleteDialog(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete {selectedPosts.length} Posts</h3>
            <p className="text-sm text-slate-600 mb-6">Are you sure you want to delete {selectedPosts.length} posts? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowBulkDeleteDialog(false)}>Cancel</Button>
              <Button onClick={confirmBulkDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete All</Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowRejectDialog(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Reject Post</h3>
            <p className="text-sm text-slate-600 mb-4">Reject &ldquo;{postToReject?.title}&rdquo;? The author will be notified.</p>
            <textarea
              placeholder="Rejection reason (optional)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 outline-none resize-none h-24 mb-4"
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
              <Button onClick={confirmReject} className="bg-red-600 hover:bg-red-700 text-white">Reject</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
