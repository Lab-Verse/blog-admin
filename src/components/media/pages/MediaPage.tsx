'use client';

import React from 'react';
import { Media, UpdateMediaDto } from '@/redux/types/media/media.types';
import MediaUpload from '../ui/MediaUpload';
import MediaGallery from '../ui/MediaGallery';
import MediaDetails from '../ui/MediaDetails';

interface MediaPageProps {
    media: Media[];
    selectedMedia: Media | null;
    isLoading: boolean;
    onSelect: (media: Media | null) => void;
    onUpload: (file: File) => Promise<void>;
    onUpdate: (id: string, data: UpdateMediaDto) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export default function MediaPage({
    media,
    selectedMedia,
    isLoading,
    onSelect,
    onUpload,
    onUpdate,
    onDelete,
}: MediaPageProps) {
    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Media Library</h1>
                <p className="text-gray-500 mt-1">Upload and manage your media files.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* Left Column: Upload & Gallery */}
                <div className="flex-1 flex flex-col gap-6 min-h-0 overflow-hidden">
                    <div className="shrink-0">
                        <MediaUpload onUpload={onUpload} />
                    </div>

                    <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm p-6 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <MediaGallery
                                media={media}
                                onSelect={onSelect}
                                selectedId={selectedMedia?.id || null}
                            />
                        )}
                    </div>
                </div>

                {/* Right Column: Details Sidebar */}
                {selectedMedia && (
                    <div className="w-full lg:w-96 shrink-0 lg:h-full overflow-hidden">
                        <MediaDetails
                            media={selectedMedia}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            onClose={() => onSelect(null)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
