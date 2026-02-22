'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PostForm from '../ui/PostForm';
import { Post, PostStatus } from '@/redux/types/post/posts.types';
import { Category } from '@/redux/types/category/categories.types';
import { Tag } from '@/redux/types/tags/types';
import { Media } from '@/redux/types/media/media.types';

interface EditPostPageProps {
    post: Post;
    categories: Category[];
    tags: Tag[];
    mediaList: Media[];
    onSubmit: (data: {
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        description: string;
        category_id: string;
        status: PostStatus;
        featured_image?: File | string;
        tag_ids?: string[];
        media_ids?: string[];
    }) => Promise<void>;
    onCancel: () => void;
}

export default function EditPostPage({ post, categories, tags, mediaList, onSubmit, onCancel }: EditPostPageProps) {
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
                            description: post.description || '',
                            category_id: post.category_id,
                            status: post.status,
                            featured_image: post.featured_image || '',
                            tag_ids: post.tags?.map((tag) => tag.id) || [],
                            media_ids: post.media?.map((media) => media.id) || [],
                        }}
                        categories={categories}
                        tags={tags}
                        mediaList={mediaList}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        submitLabel="Update Post"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
