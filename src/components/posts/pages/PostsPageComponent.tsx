'use client';

import { useState } from 'react';
import { Post, PostStatus } from '@/redux/types/post/posts.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Check, X } from 'lucide-react';
import Image from 'next/image';

interface PostsPageComponentProps {
  posts: Post[];
  isLoading: boolean;
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
}

export default function PostsPageComponent({
  posts,
  isLoading,
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
}: PostsPageComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [postToReject, setPostToReject] = useState<Post | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelection = (postId: string) => {
    setSelectedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map((p) => p.id));
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
        return 'Pending Approval';
      case PostStatus.DRAFT:
        return 'Draft';
      case PostStatus.ARCHIVED:
        return 'Archived';
      default:
        return status;
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

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Posts Management</h1>
            <p className="text-slate-500 mt-1">Manage all posts from every author</p>
          </div>
          <Button
            onClick={onAdd}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-primary-600/20"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Post
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 outline-none transition-all"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PostStatus | 'all')}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 outline-none min-w-[180px] cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value={PostStatus.PUBLISHED}>Published</option>
            <option value={PostStatus.PENDING}>Pending Approval</option>
            <option value={PostStatus.DRAFT}>Draft</option>
            <option value={PostStatus.ARCHIVED}>Archived</option>
          </select>
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedPosts.length > 0 && (
          <div className="flex items-center gap-4 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3">
            <span className="text-sm font-medium text-primary-700">{selectedPosts.length} selected</span>
            <div className="flex flex-1 gap-2">
              <Button
                onClick={handleBulkPublish}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg"
                size="sm"
              >
                Publish Selected
              </Button>
              <Button
                onClick={handleBulkUnpublish}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1.5 rounded-lg"
                size="sm"
              >
                Unpublish Selected
              </Button>
              <Button
                onClick={handleBulkDeleteClick}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-lg"
                size="sm"
              >
                Delete Selected
              </Button>
            </div>
            <Button
              onClick={clearSelection}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Clear Selection
            </Button>
          </div>
        )}

        {/* Posts Table */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center justify-center">
            <Search className="w-10 h-10 text-slate-300 mb-3" />
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No posts found</h3>
            <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Post
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider pr-6">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPosts.map((post) => (
                    <tr
                      key={post.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        selectedPosts.includes(post.id) ? 'bg-primary-50/50' : ''
                      }`}
                    >
                      <td className="whitespace-nowrap py-4 pl-6 pr-3">
                        <input
                          type="checkbox"
                          checked={selectedPosts.includes(post.id)}
                          onChange={() => toggleSelection(post.id)}
                          className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="whitespace-nowrap py-4 px-3">
                        <div className="flex items-center gap-3">
                          {post.featured_image && isValidUrl(post.featured_image) ? (
                            <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden">
                              <Image
                                alt={post.title}
                                src={post.featured_image}
                                className="object-cover"
                                fill
                                sizes="40px"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center">
                              <span className="text-slate-400 text-xs font-medium">No</span>
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-medium text-sm text-slate-900 truncate max-w-[300px]">
                              {post.title}
                            </div>
                            {post.category && (
                              <div className="text-xs text-slate-500 mt-0.5">{post.category.name}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-slate-600">
                        {post.user?.name || post.user?.email || 'Unknown'}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3">
                        <Badge className={`${getStatusBadge(post.status)} text-xs font-medium border`}>
                          {getStatusLabel(post.status)}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-slate-500">
                        {new Date(post.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {post.status === PostStatus.PENDING && onApprove && onReject ? (
                            <>
                              <Button
                                onClick={() => onApprove(post)}
                                variant="ghost"
                                size="sm"
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs h-8 px-2"
                              >
                                <Check className="w-3.5 h-3.5 mr-1" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleRejectClick(post)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs h-8 px-2"
                              >
                                <X className="w-3.5 h-3.5 mr-1" />
                                Reject
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={() => onEdit(post)}
                                variant="ghost"
                                size="sm"
                                className="text-slate-600 hover:text-primary-600 hover:bg-primary-50 text-xs h-8 px-2"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDeleteClick(post)}
                                variant="ghost"
                                size="sm"
                                className="text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs h-8 px-2"
                              >
                                Delete
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
          <div className="flex justify-center gap-2 pt-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => onPageChange(page)}
                variant={currentPage === page ? 'primary' : 'outline'}
                className={`w-10 h-10 p-0 rounded-xl transition-all ${
                  currentPage === page
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteDialog(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Post</h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete &ldquo;{postToDelete?.title}&rdquo;? This action cannot be undone.
            </p>
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
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete {selectedPosts.length} posts? This action cannot be undone.
            </p>
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
            <p className="text-sm text-slate-600 mb-4">
              Reject &ldquo;{postToReject?.title}&rdquo;? The author will be notified.
            </p>
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