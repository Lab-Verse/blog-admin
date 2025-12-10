'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Media, UpdateMediaDto } from '@/redux/types/media/media.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MediaDetailsProps {
    media: Media;
    onUpdate: (id: string, data: UpdateMediaDto) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onClose: () => void;
}

export default function MediaDetails({ media, onUpdate, onDelete, onClose }: MediaDetailsProps) {
    const [formData, setFormData] = useState<UpdateMediaDto>({
        title: media.title || '',
        altText: media.altText || '',
        description: media.description || '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setFormData({
            title: media.title || '',
            altText: media.altText || '',
            description: media.description || '',
        });
    }, [media]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onUpdate(media.id, formData);
        } catch (error) {
            console.error('Failed to update media:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) return;

        setIsDeleting(true);
        try {
            await onDelete(media.id);
            onClose();
        } catch (error) {
            console.error('Failed to delete media:', error);
            setIsDeleting(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Card className="h-full border-0 shadow-xl ring-1 ring-gray-200/50">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <CardTitle className="text-lg font-semibold text-gray-800">File Details</CardTitle>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                <div className="space-y-6">
                    {/* Preview */}
                    <div className="rounded-lg bg-gray-100 p-4 flex items-center justify-center">
                        {media.type.startsWith('image/') ? (
                            <Image
                                src={media.url}
                                alt={media.altText || media.filename}
                                width={400}
                                height={256}
                                className="max-h-64 max-w-full rounded object-contain"
                            />
                        ) : (
                            <div className="text-gray-400">
                                <svg className="h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Metadata Read-only */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="block text-gray-500">Filename</span>
                            <span className="font-medium text-gray-900 truncate block" title={media.filename}>
                                {media.filename}
                            </span>
                        </div>
                        <div>
                            <span className="block text-gray-500">Type</span>
                            <span className="font-medium text-gray-900">{media.type}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500">Size</span>
                            <span className="font-medium text-gray-900">{formatSize(media.size)}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500">Uploaded</span>
                            <span className="font-medium text-gray-900">
                                {media.createdAt ? new Date(media.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-4"></div>

                    {/* Edit Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Media title"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="altText">Alt Text</Label>
                            <Input
                                id="altText"
                                value={formData.altText}
                                onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                                placeholder="Alternative text for accessibility"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Description or caption"
                                rows={3}
                            />
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <Button type="submit" disabled={isSaving} className="flex-1 bg-blue-600 hover:bg-blue-700">
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                disabled={isDeleting}
                                onClick={handleDelete}
                                className="flex-1"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete File'}
                            </Button>
                        </div>
                    </form>

                    <div className="pt-2">
                        <Label className="text-xs text-gray-500">File URL</Label>
                        <div className="flex mt-1">
                            <Input readOnly value={media.url} className="text-xs bg-gray-50" />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="ml-2"
                                onClick={() => {
                                    navigator.clipboard.writeText(media.url);
                                    // Could add toast here
                                }}
                            >
                                Copy
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
