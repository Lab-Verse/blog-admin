'use client';

import React from 'react';
import Image from 'next/image';
import { Category } from '@/redux/types/category/categories.types'; 
import CategoryStatusBadge from './CategoryStatusBadge';
import { Card, CardContent } from '@/components/ui/card';

// Extended category interface for display purposes
interface ExtendedCategory extends Category {
  color?: string;
  postCount?: number;
  iconUrl?: string;
}

interface CategoryCardProps {
    category: ExtendedCategory;
    onEdit: (category: ExtendedCategory) => void;
    onDelete: (category: ExtendedCategory) => void;
    onClick?: (category: ExtendedCategory) => void;
}

export default function CategoryCard({ category, onEdit, onDelete, onClick }: CategoryCardProps) {
    return (
        <div onClick={() => onClick?.(category)} className="cursor-pointer">
            <Card
                className="border-0 shadow-md ring-1 ring-gray-200/50 hover:shadow-xl hover:ring-gray-300/50 transition-all duration-300 overflow-hidden group"
            >
                {/* Color bar */}
                <div
                    className="h-2 w-full"
                    style={{ backgroundColor: category.color || '#3B82F6' }}
                />

                <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                {category.name}
                            </h3>
                            <p className="text-sm text-gray-500 font-mono mt-0.5">/{category.slug}</p>
                        </div>
                        <CategoryStatusBadge isActive={category.isActive} />
                    </div>

                    {category.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {category.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            {category.postCount !== undefined && (
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="font-medium">{category.postCount}</span>
                                    <span>posts</span>
                                </div>
                            )}
                            {category.iconUrl && (
                                <div className="flex items-center gap-1">
                                    <Image src={category.iconUrl} alt="" width={16} height={16} className="w-4 h-4 object-contain" />
                                </div>
                            )}
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
