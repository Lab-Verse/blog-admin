'use client';

import { useState } from 'react';
import { Tag } from '@/redux/types/tags/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Plus, Edit, Trash2, Hash, TrendingUp, LayoutGrid, List as ListIcon, Tag as TagIcon } from 'lucide-react';

interface TagsPageComponentProps {
    tags: Tag[];
    isLoading: boolean;
    onAdd: () => void;
    onEdit: (tag: Tag) => void;
    onDelete: (tag: Tag) => void;
}

export default function TagsPageComponent({
    tags,
    isLoading,
    onAdd,
    onEdit,
    onDelete,
}: TagsPageComponentProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredTags = tags.filter((tag) =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate stats
    const totalTags = tags.length;
    const totalPosts = tags.reduce((sum, t) => sum + (t.posts_count || 0), 0);
    const avgPosts = totalTags > 0 ? Math.round(totalPosts / totalTags) : 0;

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Tags Management
                        </h1>
                        <p className="text-slate-500">
                            Organize content with smart tags and categories.
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
                            Create Tag
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Total Tags', value: totalTags, icon: Hash, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Total Posts', value: totalPosts, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                        { label: 'Avg Posts/Tag', value: avgPosts, icon: Hash, color: 'text-orange-600', bg: 'bg-orange-50' },
                    ].map((stat, i) => (
                        <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <div className={`text-2xl font-bold ${stat.color}`}>{isLoading ? '-' : stat.value}</div>
                                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
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
                            placeholder="Search tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-slate-900 placeholder:text-slate-400 transition-all"
                        />
                    </div>
                </div>

                {/* Tags Grid */}
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <Card key={i} className="border-0 shadow-sm animate-pulse h-48">
                                <CardContent className="p-6">
                                    <div className="h-4 bg-slate-100 rounded mb-4"></div>
                                    <div className="h-3 bg-slate-100 rounded mb-2"></div>
                                    <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                                </CardContent>
                            </Card>
                        ))
                    ) : filteredTags.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white/50 rounded-3xl border border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <Hash className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-1">No tags found</h3>
                            <p className="text-slate-500">Create a new tag to get started</p>
                        </div>
                    ) : (
                        filteredTags.map((tag) => (
                            <Card
                                key={tag.id}
                                className={`border-0 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-pointer ${viewMode === 'list' ? 'flex flex-row items-center p-4' : ''}`}
                            >
                                <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1 flex items-center justify-between p-0' : ''}`}>
                                    <div className={`flex items-start justify-between ${viewMode === 'list' ? 'w-1/3' : 'mb-4'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 duration-300">
                                                <Hash className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors">{tag.name}</h3>
                                                <p className="text-sm text-slate-500">/{tag.slug}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`${viewMode === 'list' ? 'flex items-center gap-8' : 'flex items-center justify-between mb-4'}`}>
                                        <div className="text-sm text-slate-500">
                                            <span className="font-medium text-slate-900">{tag.posts_count || 0}</span> posts
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            {tag.created_at ? new Date(tag.created_at).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </div>

                                    <div className={`flex gap-2 ${viewMode === 'list' ? 'ml-8' : 'pt-4 border-t border-slate-50'}`}>
                                        <Button
                                            onClick={() => onEdit(tag)}
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-slate-600 hover:text-primary-600 hover:bg-primary-50"
                                        >
                                            <Edit className="w-4 h-4 mr-1.5" />
                                            {viewMode === 'grid' && 'Edit'}
                                        </Button>
                                        <Button
                                            onClick={() => onDelete(tag)}
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-slate-600 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1.5" />
                                            {viewMode === 'grid' && 'Delete'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
