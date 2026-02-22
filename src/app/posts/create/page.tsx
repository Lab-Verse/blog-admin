'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CreatePostPage from '@/components/posts/pages/CreatePostPage';
import { useCreatePostMutation } from '@/redux/api/post/posts.api';
import { useGetCategoriesQuery } from '@/redux/api/category/categoriesApi';
import { useGetTagsQuery } from '@/redux/api/tags/tagsApi';
import { useGetMediaQuery } from '@/redux/api/media/mediaApi';
import { PostStatus } from '@/redux/types/post/posts.types';

export default function Page() {
    const router = useRouter();
    const [createPost] = useCreatePostMutation();
    const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
    const { data: tagsData, isLoading: tagsLoading } = useGetTagsQuery();
    const { data: mediaData, isLoading: mediaLoading } = useGetMediaQuery();
    const mediaItems = Array.isArray(mediaData) ? mediaData : mediaData?.items || [];

    if (categoriesLoading || tagsLoading || mediaLoading) {
        return <div className="p-6">Loading...</div>;
    }

    const handleSubmit = async (data: {
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
    }) => {
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('slug', data.slug);
            formData.append('content', data.content);
            formData.append('excerpt', data.excerpt);
            formData.append('description', data.description);
            formData.append('category_id', data.category_id);
            formData.append('status', data.status);
            
            if (data.featured_image instanceof File) {
                formData.append('featured_image', data.featured_image);
            }

            if (data.tag_ids && data.tag_ids.length > 0) {
                data.tag_ids.forEach((tagId) => {
                    formData.append('tag_ids[]', tagId);
                });
            }

            if (data.media_ids && data.media_ids.length > 0) {
                data.media_ids.forEach((mediaId) => {
                    formData.append('media_ids[]', mediaId);
                });
            }

            await createPost(formData).unwrap();
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
            tags={tagsData || []}
            mediaList={mediaItems}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
}
