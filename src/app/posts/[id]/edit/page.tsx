'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import EditPostPage from '@/components/posts/pages/EditPostPage';
import { useGetPostByIdQuery, useUpdatePostMutation } from '@/redux/api/post/posts.api';
import { useGetCategoriesQuery } from '@/redux/api/category/categoriesApi';
import { useGetTagsQuery } from '@/redux/api/tags/tagsApi';
import { useGetMediaQuery } from '@/redux/api/media/mediaApi';
import { PostStatus } from '@/redux/types/post/posts.types';

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const { data: post, isLoading, error } = useGetPostByIdQuery(id);
    const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery({});
    const { data: tagsData, isLoading: tagsLoading } = useGetTagsQuery();
    const { data: mediaData, isLoading: mediaLoading } = useGetMediaQuery();
    const mediaItems = Array.isArray(mediaData) ? mediaData : mediaData?.items || [];
    const [updatePost] = useUpdatePostMutation();

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
            await updatePost({ id, body: data }).unwrap();
            router.push('/posts');
        } catch (error) {
            console.error('Failed to update post:', error);
            alert('Failed to update post');
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (isLoading || categoriesLoading || tagsLoading || mediaLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
                <p className="text-lg font-medium">Post not found</p>
                <button
                    onClick={() => router.push('/posts')}
                    className="mt-4 text-blue-600 hover:underline"
                >
                    Go back to posts
                </button>
            </div>
        );
    }

    return (
        <EditPostPage
            post={post}
            categories={categoriesData?.items || []}
            tags={tagsData || []}
            mediaList={mediaItems}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
}

