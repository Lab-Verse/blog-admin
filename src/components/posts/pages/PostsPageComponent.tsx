'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Post, PostStatus } from '@/redux/types/post/posts.types';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Plus, Edit, Trash2, Eye, Calendar, User, LayoutGrid, List as ListIcon, Check, X } from 'lucide-react';
import Image from 'next/image';

interface PostsPageComponentProps {
  posts: Post[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onApprove?: (post: Post) => void;
  onReject?: (post: Post) => void;
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
  currentPage,
  onPageChange,
  totalPages,
}: PostsPageComponentProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PostStatus) => {
    const styles = {
      [PostStatus.PUBLISHED]: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 ring-1 ring-emerald-500/20',
      [PostStatus.PENDING]: 'bg-orange-500/10 text-orange-600 border-orange-200 ring-1 ring-orange-500/20',
      [PostStatus.DRAFT]: 'bg-amber-500/10 text-amber-600 border-amber-200 ring-1 ring-amber-500/20',
      [PostStatus.ARCHIVED]: 'bg-slate-500/10 text-slate-600 border-slate-200 ring-1 ring-slate-500/20',
    };
    return styles[status] || styles[PostStatus.DRAFT];
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
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Posts Management
            </h1>
            <p className="text-slate-500">
              Manage, edit, and publish your content to the world.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <ListIcon size={18} />
              </button>
            </div>
            <Button
              onClick={onAdd}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Post
            </Button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-sm sticky top-4 z-40">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Search posts by title or slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-slate-900 placeholder:text-slate-400 transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PostStatus | 'all')}
              className="px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-slate-700 font-medium min-w-40 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="all">All Status</option>
              <option value={PostStatus.PUBLISHED}>Published</option>
              <option value={PostStatus.PENDING}>Pending Approval</option>
              <option value={PostStatus.DRAFT}>Draft</option>
              <option value={PostStatus.ARCHIVED}>Archived</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 h-64 animate-pulse">
                <div className="w-full h-32 bg-slate-100 rounded-xl mb-4"></div>
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-1">No posts found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden cursor-pointer flex ${viewMode === 'list' ? 'flex-row h-48' : 'flex-col'}`}
                onClick={() => router.push(`/posts/${post.id}`)}
              >
                {/* Image Section */}
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64 h-full' : 'w-full h-48'}`}>
                  {post.featured_image && isValidUrl(post.featured_image) ? (
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <Eye className="w-10 h-10 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${getStatusBadge(post.status)}`}>
                      {post.status}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <CardContent className={`flex-1 p-5 flex flex-col justify-between ${viewMode === 'list' ? 'py-4' : ''}`}>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                      {post.excerpt || 'No excerpt available for this post.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      {post.user && (
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[100px]">{post.user.name || 'Unknown'}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-50" onClick={(e) => e.stopPropagation()}>
                      {post.status === PostStatus.PENDING && onApprove && onReject ? (
                        <>
                          <Button
                            onClick={() => onApprove(post)}
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          >
                            <Check className="w-4 h-4 mr-1.5" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => onReject(post)}
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-1.5" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => onEdit(post)}
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-slate-600 hover:text-primary-600 hover:bg-primary-50"
                          >
                            <Edit className="w-4 h-4 mr-1.5" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => onDelete(post)}
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-slate-600 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1.5" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => onPageChange(page)}
                variant={currentPage === page ? "primary" : "outline"}
                className={`w-10 h-10 p-0 rounded-xl transition-all ${currentPage === page
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20 hover:bg-primary-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {page}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}