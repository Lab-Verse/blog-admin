'use client';

import React, { useState, useEffect } from 'react';
import PostMediaPage from '@/components/post-media/pages/PostMediaPage';
import { useGetPostsQuery } from '@/redux/api/post/posts.api';
import { useGetMediaQuery } from '@/redux/api/media/mediaApi';
import {
    useGetPostMediaByPostQuery,
    useAttachMediaToPostMutation,
    useDetachPostMediaMutation,
} from '@/redux/api/postmedia/postMedia.api';

export default function Page() {
    const { data: postsData, isLoading: isLoadingPosts } = useGetPostsQuery();
    const posts = postsData?.data || [];
    const { data: mediaData } = useGetMediaQuery();
    const mediaItems = Array.isArray(mediaData) ? mediaData : mediaData?.items || [];

    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    // Auto-select first post if available and none selected
    useEffect(() => {
        if (posts && posts.length > 0 && !selectedPostId) {
            setSelectedPostId(posts[0].id);
        }
    }, [posts, selectedPostId]);

    const { data: postMedia } = useGetPostMediaByPostQuery(selectedPostId || '', {
        skip: !selectedPostId,
    });

    const [attachMedia] = useAttachMediaToPostMutation();
    const [detachMedia] = useDetachPostMediaMutation();

    const handleAttach = async (mediaId: string) => {
        if (!selectedPostId) return;
        try {
            await attachMedia({ post_id: selectedPostId, media_id: mediaId }).unwrap();
        } catch (error) {
            console.error('Failed to attach media:', error);
            alert('Failed to attach media');
        }
    };

    const handleDetach = async (postMediaId: string) => {
        if (!selectedPostId) return;
        try {
            await detachMedia({ id: postMediaId, postId: selectedPostId }).unwrap();
        } catch (error) {
            console.error('Failed to detach media:', error);
            alert('Failed to detach media');
        }
    };

    return (
        <PostMediaPage
            posts={posts || []}
            selectedPostId={selectedPostId}
            onSelectPost={setSelectedPostId}
            allMedia={mediaItems}
            postMedia={postMedia || []}
            onAttach={handleAttach}
            onDetach={handleDetach}
            isLoadingPosts={isLoadingPosts}
        />
    );
}
