'use client';

import React, { useState } from 'react';
import { Tag } from '@/redux/types/tags/types';
import { PostTag } from '@/redux/types/posttag/postTags.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface PostTagsManagerProps {
    postId: string;
    allTags: Tag[];
    postTags: PostTag[];
    onAttach: (tagId: string) => Promise<void>;
    onDetach: (postTagId: string) => Promise<void>;
}

export default function PostTagsManager({
    postId,
    allTags,
    postTags,
    onAttach,
    onDetach,
}: PostTagsManagerProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const filteredTags = allTags.filter((tag) =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isAttached = (tagId: string) => {
        return postTags.some((pt) => pt.tag_id === tagId);
    };

    const handleToggle = async (tagId: string) => {
        setProcessingId(tagId);
        try {
            const existingRelation = postTags.find((pt) => pt.tag_id === tagId);
            if (existingRelation) {
                await onDetach(existingRelation.id);
            } else {
                await onAttach(tagId);
            }
        } catch (error) {
            console.error('Failed to toggle tag:', error);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <Card className="h-full border-0 shadow-xl ring-1 ring-gray-200/50">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-6 py-4">
                <div className="flex flex-col space-y-4">
                    <CardTitle className="text-lg font-semibold text-gray-800">Manage Tags</CardTitle>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <Input
                            placeholder="Search tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                    {filteredTags.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No tags found matching &quot;{searchTerm}&quot;
                        </div>
                    ) : (
                        filteredTags.map((tag) => {
                            const attached = isAttached(tag.id);
                            const isProcessing = processingId === tag.id;

                            return (
                                <div
                                    key={tag.id}
                                    className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors ${attached ? 'bg-blue-50/30' : ''
                                        }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">{tag.name}</span>
                                        <span className="text-xs text-gray-500">{tag.slug}</span>
                                    </div>
                                    <button
                                        onClick={() => handleToggle(tag.id)}
                                        disabled={isProcessing}
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${attached ? 'bg-blue-600' : 'bg-gray-200'
                                            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        role="switch"
                                        aria-checked={attached}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${attached ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                        />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
