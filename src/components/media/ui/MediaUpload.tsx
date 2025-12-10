'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';

interface MediaUploadProps {
    onUpload: (file: File) => Promise<void>;
}

export default function MediaUpload({ onUpload }: MediaUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setIsUploading(true);
        try {
            // Upload files sequentially
            for (const file of acceptedFiles) {
                await onUpload(file);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload file');
        } finally {
            setIsUploading(false);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
            'video/*': [],
            'application/pdf': [],
        },
        disabled: isUploading,
    });

    return (
        <Card className={`border-2 border-dashed transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
            }`}>
            <CardContent className="p-0">
                <div
                    {...getRootProps()}
                    className="flex flex-col items-center justify-center p-12 cursor-pointer text-center"
                >
                    <input {...getInputProps()} />
                    <div className="mb-4 rounded-full bg-blue-50 p-4 text-blue-600">
                        {isUploading ? (
                            <svg className="h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        )}
                    </div>
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">
                        {isUploading ? 'Uploading...' : 'Upload Media'}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {isDragActive
                            ? 'Drop files here'
                            : 'Drag & drop files here, or click to select'}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                        Supports images, videos, and PDFs
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
