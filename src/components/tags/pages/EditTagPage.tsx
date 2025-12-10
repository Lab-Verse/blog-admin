'use client';

import React from 'react';
import { Tag } from '@/redux/types/tags/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TagForm from '../ui/TagForm';

interface EditTagPageProps {
    tag: Tag;
    onSubmit: (data: { name: string; slug: string }) => Promise<void>;
    onCancel: () => void;
}

export default function EditTagPage({ tag, onSubmit, onCancel }: EditTagPageProps) {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Tag</h1>
                <p className="text-gray-500 mt-1">Update tag information.</p>
            </div>

            <Card className="border-0 shadow-xl ring-1 ring-gray-200/50">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <CardTitle className="text-lg font-semibold text-gray-800">Tag Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <TagForm
                        initialData={{ name: tag.name, slug: tag.slug }}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        isEdit
                    />
                </CardContent>
            </Card>

            <Card className="border-0 shadow-xl ring-1 ring-gray-200/50">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <CardTitle className="text-lg font-semibold text-gray-800">Tag Statistics</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Posts Count</p>
                            <p className="text-2xl font-bold text-gray-900">{tag.posts_count}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Created</p>
                            <p className="text-lg font-medium text-gray-900">
                                {new Date(tag.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
