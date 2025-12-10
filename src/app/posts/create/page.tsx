'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CreatePostPage from '@/components/posts/pages/CreatePostPage';
import { useCreatePostMutation } from '@/redux/api/post/posts.api';
import { useGetCategoriesQuery } from '@/redux/api/category/categoriesApi';
import { PostStatus } from '@/redux/types/post/posts.types';

export default function Page() {
    const router = useRouter();
    const [createPost] = useCreatePostMutation();
    const { data: categoriesData } = useGetCategoriesQuery({});

    const handleSubmit = async (data: {
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        category_id: string;
        status: PostStatus;
        featured_image: string;
    }) => {
        try {
            await createPost(data).unwrap();
            router.push('/posts');
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('Failed to create post');
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <CreatePostPage
            categories={categoriesData?.items || []}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
}
