'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PostForm from '../ui/PostForm';
import { Post, PostStatus } from '@/redux/types/post/posts.types';
import { Category } from '@/redux/types/category/categories.types';

interface EditPostPageProps {
    post: Post;
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

export default function EditPostPage({ post, categories, onSubmit, onCancel }: EditPostPageProps) {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
                <p className="text-gray-500 mt-1">Update post content and settings.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Post Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <PostForm
                        initialData={{
                            title: post.title,
                            slug: post.slug,
                            content: post.content,
                            excerpt: post.excerpt || '',
                            category_id: post.category_id,
                            status: post.status,
                            featured_image: post.featured_image || '',
                        }}
                        categories={categories}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        submitLabel="Update Post"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
