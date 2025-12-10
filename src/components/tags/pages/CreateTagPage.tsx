'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TagForm from '../ui/TagForm';

interface CreateTagPageProps {
    onSubmit: (data: { name: string; slug: string }) => Promise<void>;
    onCancel: () => void;
}

export default function CreateTagPage({ onSubmit, onCancel }: CreateTagPageProps) {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Tag</h1>
                <p className="text-gray-500 mt-1">Add a new tag to organize your content.</p>
            </div>

            <Card className="border-0 shadow-xl ring-1 ring-gray-200/50">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <CardTitle className="text-lg font-semibold text-gray-800">Tag Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <TagForm onSubmit={onSubmit} onCancel={onCancel} />
                </CardContent>
            </Card>
        </div>
    );
}
