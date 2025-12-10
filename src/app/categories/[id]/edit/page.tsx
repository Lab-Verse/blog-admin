'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CategoryForm from '@/components/categories/ui/CategoryForm';
import { useGetCategoryByIdQuery, useUpdateCategoryMutation } from '@/redux/api/category/categoriesApi';
import { UpdateCategoryDto } from '@/redux/types/category/categories.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: category, isLoading: isFetching } = useGetCategoryByIdQuery(id);
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: UpdateCategoryDto) => {
        try {
            setError(null);
            await updateCategory({ id, data }).unwrap();
            router.push('/categories');
        } catch (err: any) {
            setError(err?.data?.message || 'Failed to update category');
            console.error('Failed to update category:', err);
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50/30 to-blue-50/30 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50/30 to-blue-50/30 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h2>
                    <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
                    <button
                        onClick={() => router.push('/categories')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Categories
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50/30 to-blue-50/30 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
                    <p className="text-gray-600 mt-2">Update category information</p>
                </div>

                <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-linear-to-r from-purple-50 to-blue-50 border-b">
                        <CardTitle>Category Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                                {error}
                            </div>
                        )}
                        <CategoryForm
                            initialData={category}
                            onSubmit={handleSubmit}
                            onCancel={() => router.push('/categories')}
                            isLoading={isUpdating}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

