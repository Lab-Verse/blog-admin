'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Media } from '@/redux/types/media/media.types';
import { PostMedia } from '@/redux/types/postmedia/postMedia.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface PostMediaManagerProps {
    postId: string;
    allMedia: Media[];
    postMedia: PostMedia[];
    onAttach: (mediaId: string) => Promise<void>;
    onDetach: (postMediaId: string) => Promise<void>;
}

export default function PostMediaManager({
    postId,
    allMedia,
    postMedia,
    onAttach,
    onDetach,
}: PostMediaManagerProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const filteredMedia = allMedia.filter((media) =>
        media.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (media.altText && media.altText.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const isAttached = (mediaId: string) => {
        return postMedia.some((pm) => pm.media_id === mediaId);
    };

    const handleToggle = async (mediaId: string) => {
        setProcessingId(mediaId);
        try {
            const existingRelation = postMedia.find((pm) => pm.media_id === mediaId);
            if (existingRelation) {
                await onDetach(existingRelation.id);
            } else {
                await onAttach(mediaId);
            }
        } catch (error) {
            console.error('Failed to toggle media:', error);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <Card className="h-full border-0 shadow-xl ring-1 ring-gray-200/50">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-6 py-4">
                <div className="flex flex-col space-y-4">
                    <CardTitle className="text-lg font-semibold text-gray-800">Manage Media</CardTitle>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <Input
                            placeholder="Search media..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto">
                    {filteredMedia.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-8">
                            No media found matching &quot;{searchTerm}&quot;
                        </div>
                    ) : (
                        filteredMedia.map((media) => {
                            const attached = isAttached(media.id);
                            const isProcessing = processingId === media.id;

                            return (
                                <div
                                    key={media.id}
                                    className={`relative group rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${attached
                                        ? 'border-blue-500 ring-2 ring-blue-200'
                                        : 'border-gray-200 hover:border-blue-300'
                                        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => !isProcessing && handleToggle(media.id)}
                                >
                                    <div className="aspect-square bg-gray-100 relative">
                                        {media.type.startsWith('image/') ? (
                                            <Image
                                                src={media.url}
                                                alt={media.altText || media.filename}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Selection Overlay */}
                                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${attached ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                            }`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${attached ? 'bg-blue-500 text-white' : 'bg-white/20 text-white border-2 border-white'
                                                }`}>
                                                {attached && (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-white text-xs truncate font-medium text-gray-700 border-t border-gray-100">
                                        {media.filename}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
