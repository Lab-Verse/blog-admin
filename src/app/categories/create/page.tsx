'use client';

import React, { useState } from 'react';
import CategoryForm from '@/components/categories/ui/CategoryForm';
import { useCreateCategoryMutation } from '@/redux/api/category/categoriesApi';
import { CreateCategoryDto } from '@/redux/types/category/categories.types';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Page() {
    const router = useRouter();
    const [createCategory, { isLoading }] = useCreateCategoryMutation();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: CreateCategoryDto) => {
        try {
            setError(null);
            await createCategory(data).unwrap();
            router.push('/categories');
        } catch (err) {
            const errorMessage = err && typeof err === 'object' && 'data' in err 
                ? (err.data as { message?: string })?.message || 'Failed to create category'
                : 'Failed to create category';
            setError(errorMessage);
            console.error('Failed to create category:', err);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50/30 to-blue-50/30 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Create Category</h1>
                    <p className="text-gray-600 mt-2">Add a new category to organize your content</p>
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
                            onSubmit={handleSubmit}
                            onCancel={() => router.push('/categories')}
                            isLoading={isLoading}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
