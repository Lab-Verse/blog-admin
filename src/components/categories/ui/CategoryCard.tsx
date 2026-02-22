'use client';

import React from 'react';
import { Category } from '@/redux/types/category/categories.types'; 
import CategoryStatusBadge from './CategoryStatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { FolderOpen, FileText, Users, Calendar } from 'lucide-react';

interface CategoryCardProps {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    onClick?: (category: Category) => void;
}

export default function CategoryCard({ category, onEdit, onDelete, onClick }: CategoryCardProps) {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const colorIndex = category.name.charCodeAt(0) % colors.length;
    const categoryColor = colors[colorIndex];

    return (
        <div onClick={() => onClick?.(category)} className="cursor-pointer">
            <Card
                className="border-0 shadow-md ring-1 ring-gray-200/50 hover:shadow-xl hover:ring-gray-300/50 transition-all duration-300 overflow-hidden group"
            >
                {/* Color bar */}
                <div
                    className="h-2 w-full"
                    style={{ backgroundColor: categoryColor }}
                />

                <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div 
                                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${categoryColor}15` }}
                            >
                                <FolderOpen className="w-6 h-6" style={{ color: categoryColor }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-xs text-gray-500 font-mono mt-0.5">/{category.slug}</p>
                            </div>
                        </div>
                        <CategoryStatusBadge isActive={category.is_active} />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold">{category.posts_count || 0}</span>
                            <span className="text-xs">posts</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold">{category.followers_count || 0}</span>
                            <span className="text-xs">followers</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(category.created_at).toLocaleDateString()}</span>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(category);
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`Delete category "${category.name}"?`)) {
                                        onDelete(category);
                                    }
                                }}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
