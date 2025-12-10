'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PostForm from '../ui/PostForm';
import { Category } from '@/redux/types/category/categories.types';
import { PostStatus } from '@/redux/types/post/posts.types';

interface CreatePostPageProps {
    categories: Category[];
    onSubmit: (data: {
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        category_id: string;
        status: PostStatus;
        featured_image: string;
    }) => Promise<void>;
    onCancel: () => void;
}

export default function CreatePostPage({ categories, onSubmit, onCancel }: CreatePostPageProps) {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
                <p className="text-gray-500 mt-1">Write and publish a new blog post.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Post Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <PostForm
                        categories={categories}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        submitLabel="Create Post"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
