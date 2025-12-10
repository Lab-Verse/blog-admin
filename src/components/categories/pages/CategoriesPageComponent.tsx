'use client';

import { useState } from 'react';
import { Category, CategoryStatus } from '@/redux/types/category/categories.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Plus, Edit, Trash2, FolderOpen, BarChart3, LayoutGrid, List as ListIcon } from 'lucide-react';

interface CategoriesPageComponentProps {
  categories: Category[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

export default function CategoriesPageComponent({
  categories,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
  currentPage,
  onPageChange,
  totalPages,
}: CategoriesPageComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats from real data
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.isActive).length;
  const totalPosts = categories.reduce((sum, c) => sum + (c.postCount || 0), 0);
  const avgPosts = totalCategories > 0 ? Math.round(totalPosts / totalCategories) : 0;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Categories
            </h1>
            <p className="text-slate-500">
              Organize your content structure efficiently.
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
              Add Category
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Categories', value: totalCategories, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Active', value: activeCategories, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Total Posts', value: totalPosts, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Avg Posts/Cat', value: avgPosts, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{isLoading ? '-' : stat.value}</div>
                  <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <BarChart3 className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Bar */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-sm sticky top-4 z-40">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-slate-900 placeholder:text-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-48 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                  <div className="w-16 h-6 bg-slate-100 rounded-full"></div>
                </div>
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FolderOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-1">No categories found</h3>
            <p className="text-slate-500">Create a new category to get started</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className={`group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'flex items-center p-4 gap-6' : 'p-6'}`}
              >
                <div className={`flex items-start justify-between ${viewMode === 'list' ? 'flex-1' : 'mb-4'}`}>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 duration-300"
                      style={{ backgroundColor: `${category.color}20` || '#e2e8f0' }}
                    >
                      <FolderOpen className="w-6 h-6" style={{ color: category.color || '#64748b' }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors">{category.name}</h3>
                      <p className="text-sm text-slate-500 line-clamp-1">{category.description || 'No description'}</p>
                    </div>
                  </div>
                  {viewMode === 'grid' && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${category.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  )}
                </div>

                <div className={`${viewMode === 'list' ? 'flex items-center gap-8 mr-8' : 'space-y-4'}`}>
                  {viewMode === 'list' && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${category.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  )}

                  <div className={`flex items-center justify-between text-sm text-slate-500 ${viewMode === 'list' ? 'gap-8' : ''}`}>
                    <span className="flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4" />
                      {category.postCount || 0} posts
                    </span>
                    <span>{category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>

                  <div className={`flex gap-2 ${viewMode === 'list' ? '' : 'pt-4 border-t border-slate-50'}`}>
                    <Button
                      onClick={() => onEdit(category)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-slate-600 hover:text-primary-600 hover:bg-primary-50"
                    >
                      <Edit className="w-4 h-4 mr-1.5" />
                      {viewMode === 'grid' && 'Edit'}
                    </Button>
                    <Button
                      onClick={() => onDelete(category)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-slate-600 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      {viewMode === 'grid' && 'Delete'}
                    </Button>
                  </div>
                </div>
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