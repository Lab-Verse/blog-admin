'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Category, CategoryStatus } from '@/redux/types/category/categories.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Plus, Edit, Trash2, FolderOpen, BarChart3, LayoutGrid, List as ListIcon, ChevronRight, ChevronDown, GripVertical } from 'lucide-react';

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

interface CategoryNode extends Category {
  children: CategoryNode[];
}

function buildTree(categories: Category[]): CategoryNode[] {
  const map = new Map<string, CategoryNode>();
  const roots: CategoryNode[] = [];

  // Sort by display_order first
  const sorted = [...categories].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  for (const cat of sorted) {
    map.set(cat.id, { ...cat, children: [] });
  }

  for (const cat of sorted) {
    const node = map.get(cat.id)!;
    if (cat.parent_id && map.has(cat.parent_id)) {
      map.get(cat.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
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
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoryTree = useMemo(() => buildTree(filteredCategories), [filteredCategories]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    const allParentIds = categories.filter(c => !c.parent_id).map(c => c.id);
    setExpandedIds(new Set(allParentIds));
  };

  const collapseAll = () => setExpandedIds(new Set());

  // Calculate stats from real data
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.is_active).length;
  const totalPosts = categories.reduce((sum, c) => sum + (c.posts_count || 0), 0);
  const avgPosts = totalCategories > 0 ? Math.round(totalPosts / totalCategories) : 0;
  const parentCount = categories.filter(c => !c.parent_id).length;
  const childCount = categories.filter(c => !!c.parent_id).length;

  const renderTreeRow = (node: CategoryNode, depth: number = 0) => {
    const isParent = node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isChild = depth > 0;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
            isChild ? 'bg-slate-25' : 'bg-white'
          }`}
          style={{ paddingLeft: `${16 + depth * 32}px` }}
        >
          {/* Expand/collapse toggle */}
          <div className="w-6 flex-shrink-0">
            {isParent ? (
              <button
                onClick={() => toggleExpand(node.id)}
                className="p-0.5 rounded hover:bg-slate-200 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </button>
            ) : (
              <div className={`w-4 h-4 ${isChild ? 'ml-0.5 border-l-2 border-b-2 border-slate-300 rounded-bl' : ''}`} />
            )}
          </div>

          {/* Category icon */}
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isChild ? 'bg-slate-100' : 'bg-blue-50'
            }`}
          >
            <FolderOpen className={`w-4 h-4 ${isChild ? 'text-slate-500' : 'text-blue-600'}`} />
          </div>

          {/* Name + slug */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`truncate ${isChild ? 'text-sm text-slate-700' : 'text-sm font-semibold text-slate-900'}`}>
                {node.name}
              </h3>
              {isParent && (
                <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                  {node.children.length} sub
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono truncate">/{node.slug}</p>
          </div>

          {/* Order badge */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md" title="Display Order">
              #{node.display_order ?? 0}
            </span>
          </div>

          {/* Posts count */}
          <div className="flex items-center gap-1 text-xs text-slate-500 flex-shrink-0 w-20 justify-center">
            <BarChart3 className="w-3.5 h-3.5" />
            {node.posts_count || 0} posts
          </div>

          {/* Status */}
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
            node.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
          }`}>
            {node.is_active ? 'Active' : 'Inactive'}
          </span>

          {/* Actions */}
          <div className="flex gap-1.5 flex-shrink-0">
            <Button
              onClick={() => onEdit(node)}
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200"
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button
              onClick={() => onDelete(node)}
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Render children */}
        {isParent && isExpanded && (
          <div>
            {node.children.map(child => renderTreeRow(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

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
                onClick={() => setViewMode('tree')}
                className={`p-2 rounded-md transition-all ${viewMode === 'tree' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="Tree View"
              >
                <ListIcon size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="Grid View"
              >
                <LayoutGrid size={18} />
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Categories', value: totalCategories, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Parent Categories', value: parentCount, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Sub Categories', value: childCount, color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'Active', value: activeCategories, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Total Posts', value: totalPosts, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{isLoading ? '-' : stat.value}</div>
                  <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <BarChart3 className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search + Tree Controls */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-sm sticky top-4 z-40">
          <div className="flex items-center gap-3">
            <div className="relative group flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-slate-900 placeholder:text-slate-400 transition-all"
              />
            </div>
            {viewMode === 'tree' && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={expandAll} className="text-xs">
                  Expand All
                </Button>
                <Button variant="outline" size="sm" onClick={collapseAll} className="text-xs">
                  Collapse All
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-slate-100 animate-pulse">
                <div className="w-6 h-6 bg-slate-100 rounded"></div>
                <div className="w-9 h-9 bg-slate-100 rounded-lg"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/5"></div>
                </div>
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
        ) : viewMode === 'tree' ? (
          /* Tree View */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Tree header */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div className="w-6"></div>
              <div className="w-9"></div>
              <div className="flex-1">Category</div>
              <div className="w-12 text-center">Order</div>
              <div className="w-20 text-center">Posts</div>
              <div className="w-16 text-center">Status</div>
              <div className="w-20 text-center">Actions</div>
            </div>
            {categoryTree.map(node => renderTreeRow(node, 0))}
          </div>
        ) : (
          /* Grid View */
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {category.image_url && (
                  <div className="relative w-full h-32 overflow-hidden">
                    <Image
                      src={category.image_url}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm bg-slate-100">
                        <FolderOpen className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors">{category.name}</h3>
                        <p className="text-sm text-slate-500 font-mono">/{category.slug}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${category.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4" />
                      {category.posts_count || 0} posts
                    </span>
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-md">
                      Order: #{category.display_order ?? 0}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-slate-50">
                    <Button
                      onClick={() => onEdit(category)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-slate-600 hover:text-primary-600 hover:bg-primary-50"
                    >
                      <Edit className="w-4 h-4 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => onDelete(category)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-slate-600 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      Delete
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
