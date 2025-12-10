'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetCategoryByIdQuery } from '@/redux/api/category/categoriesApi';
import CategoryStatusBadge from '@/components/categories/ui/CategoryStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: category, isLoading } = useGetCategoryByIdQuery(id);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h2>
                    <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
                    <Button onClick={() => router.push('/categories')}>
                        Back to Categories
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/categories')}
                            className="mb-4"
                        >
                            ← Back to Categories
                        </Button>
                        <h1 className="text-4xl font-bold text-gray-900">{category.name}</h1>
                        <p className="text-gray-600 mt-2 font-mono">/{category.slug}</p>
                    </div>
                    <Button onClick={() => router.push(`/categories/${id}/edit`)}>
                        Edit Category
                    </Button>
                </div>

                {/* Details Card */}
                <Card className="border-0 shadow-xl">
                    <div
                        className="h-3 w-full rounded-t-lg"
                        style={{ backgroundColor: category.color || '#3B82F6' }}
                    />
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
                        <div className="flex items-center justify-between">
                            <CardTitle>Category Details</CardTitle>
                            <CategoryStatusBadge isActive={category.isActive} />
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {/* Description */}
                        {category.description && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                                <p className="text-gray-600">{category.description}</p>
                            </div>
                        )}

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Color</h3>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-lg border-2 border-gray-200"
                                        style={{ backgroundColor: category.color || '#3B82F6' }}
                                    />
                                    <span className="font-mono text-sm text-gray-600">
                                        {category.color || '#3B82F6'}
                                    </span>
                                </div>
                            </div>

                            {(category as any).postCount !== undefined && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Posts</h3>
                                    <div className="text-3xl font-bold text-gray-900">
                                        {(category as any).postCount}
                                    </div>
                                </div>
                            )}

                            {category.iconUrl && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Icon</h3>
                                    <img
                                        src={category.iconUrl}
                                        alt={category.name}
                                        className="w-12 h-12 object-contain"
                                    />
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Created</h3>
                                <p className="text-gray-600">
                                    {new Date(category.createdAt || new Date()).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Last Updated</h3>
                                <p className="text-gray-600">
                                    {new Date(category.updatedAt || new Date()).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

