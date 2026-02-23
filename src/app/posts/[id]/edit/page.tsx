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
            if (data.featured_image instanceof File) {
                const formData = new FormData();
                formData.append('title', data.title);
                formData.append('slug', data.slug);
                formData.append('content', data.content);
                formData.append('excerpt', data.excerpt);
                formData.append('description', data.description);
                formData.append('category_id', data.category_id);
                formData.append('status', data.status);
                formData.append('featured_image', data.featured_image);
                
                if (data.tag_ids && data.tag_ids.length > 0) {
                    formData.append('tag_ids', JSON.stringify(data.tag_ids));
                }
                if (data.media_ids && data.media_ids.length > 0) {
                    formData.append('media_ids', JSON.stringify(data.media_ids));
                }
                
                await updatePost({ id, body: formData }).unwrap();
            } else {
                await updatePost({ id, body: data as any }).unwrap();
            }
            router.push('/posts');
        } catch (error: any) {
            console.error('Failed to update post:', error);
            console.error('Error status:', error?.status);
            console.error('Error data:', error?.data);
            const errorMessage = error?.data?.message || error?.error || error?.message || 'Failed to update post';
            alert(errorMessage);
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

