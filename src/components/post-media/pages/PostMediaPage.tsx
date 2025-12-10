'use client';

import React from 'react';
import { Post } from '@/redux/types/post/posts.types';
import { Media } from '@/redux/types/media/media.types';
import { PostMedia } from '@/redux/types/postmedia/postMedia.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PostMediaManager from '../ui/PostMediaManager';

interface PostMediaPageProps {
    posts: Post[];
    selectedPostId: string | null;
    onSelectPost: (postId: string) => void;
    allMedia: Media[];
    postMedia: PostMedia[];
    onAttach: (mediaId: string) => Promise<void>;
    onDetach: (postMediaId: string) => Promise<void>;
    isLoadingPosts: boolean;
}

export default function PostMediaPage({
    posts,
    selectedPostId,
    onSelectPost,
    allMedia,
    postMedia,
    onAttach,
    onDetach,
    isLoadingPosts,
}: PostMediaPageProps) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Post Media</h1>
                <p className="text-gray-500 mt-1">Manage media attachments for posts.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Post Selector */}
                <div className="lg:col-span-1">
                    <Card className="h-full border-0 shadow-xl ring-1 ring-gray-200/50">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-6 py-4">
                            <CardTitle className="text-lg font-semibold text-gray-800">Select Post</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                                {isLoadingPosts ? (
                                    <div className="p-6 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    </div>
                                ) : posts.length === 0 ? (
                                    <div className="p-6 text-center text-gray-500">No posts found.</div>
                                ) : (
                                    posts.map((post) => (
                                        <button
                                            key={post.id}
                                            onClick={() => onSelectPost(post.id)}
                                            className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors focus:outline-none ${selectedPostId === post.id
                                                    ? 'bg-blue-50 border-l-4 border-blue-600'
                                                    : 'border-l-4 border-transparent'
                                                }`}
                                        >
                                            <div className="font-medium text-gray-900 truncate">{post.title}</div>
                                            <div className="text-xs text-gray-500 mt-1 truncate">{post.slug}</div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Media Manager */}
                <div className="lg:col-span-2">
                    {selectedPostId ? (
                        <PostMediaManager
                            postId={selectedPostId}
                            allMedia={allMedia}
                            postMedia={postMedia}
                            onAttach={onAttach}
                            onDetach={onDetach}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-12 text-gray-400">
                            Select a post to manage its media
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
