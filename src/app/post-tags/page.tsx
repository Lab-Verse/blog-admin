'use client';

import React, { useState, useEffect } from 'react';
import PostTagsPage from '@/components/post-tags/pages/PostTagsPage';
import { useGetPostsQuery } from '@/redux/api/post/posts.api';
import { useGetTagsQuery } from '@/redux/api/tags/tagsApi';
import {
    useGetPostTagsByPostQuery,
    useAttachTagToPostMutation,
    useDetachPostTagMutation,
} from '@/redux/api/posttag/postTags.api';

export default function Page() {
    const { data: posts, isLoading: isLoadingPosts } = useGetPostsQuery();
    const { data: tags } = useGetTagsQuery();

    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    // Auto-select first post if available and none selected
    useEffect(() => {
        if (posts && posts.length > 0 && !selectedPostId) {
            setSelectedPostId(posts[0].id);
        }
    }, [posts, selectedPostId]);

    const { data: postTags } = useGetPostTagsByPostQuery(selectedPostId || '', {
        skip: !selectedPostId,
    });

    const [attachTag] = useAttachTagToPostMutation();
    const [detachTag] = useDetachPostTagMutation();

    const handleAttach = async (tagId: string) => {
        if (!selectedPostId) return;
        try {
            await attachTag({ post_id: selectedPostId, tag_id: tagId }).unwrap();
        } catch (error) {
            console.error('Failed to attach tag:', error);
            alert('Failed to attach tag');
        }
    };

    const handleDetach = async (postTagId: string) => {
        if (!selectedPostId) return;
        try {
            await detachTag({ id: postTagId, postId: selectedPostId }).unwrap();
        } catch (error) {
            console.error('Failed to detach tag:', error);
            alert('Failed to detach tag');
        }
    };

    return (
        <PostTagsPage
            posts={posts || []}
            selectedPostId={selectedPostId}
            onSelectPost={setSelectedPostId}
            allTags={tags || []}
            postTags={postTags || []}
            onAttach={handleAttach}
            onDetach={handleDetach}
            isLoadingPosts={isLoadingPosts}
        />
    );
}
