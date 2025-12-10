'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Draft } from '@/redux/types/draft/drafts.types';
import { StatusBadge } from './StatusBadge';
import { X, Edit, Trash2, Calendar, FileText } from 'lucide-react';

interface DraftDetailModalProps {
    draft: Draft | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (draft: Draft) => void;
    onDelete: (id: string) => void;
}

export const DraftDetailModal: React.FC<DraftDetailModalProps> = ({
    draft,
    isOpen,
    onClose,
    onEdit,
    onDelete,
}) => {
    // Close on ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !draft) return null;

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this draft?')) {
            onDelete(draft.id);
            onClose();
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getWordCount = (content: string) => {
        return content.trim().split(/\s+/).length;
    };

    const defaultImage = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scale-in">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-danger-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Cover Image */}
                <div className="relative h-64 md:h-80 overflow-hidden bg-linear-to-br from-primary-400 to-purple-500">
                    <Image
                        src={draft.coverImageUrl || defaultImage}
                        alt={draft.title || 'Draft'}
                        width={800}
                        height={320}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = defaultImage;
                        }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute bottom-4 left-4">
                        <StatusBadge status={draft.status} className="text-sm" />
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4 leading-tight">
                        {draft.title || 'Untitled Draft'}
                    </h2>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-4 text-sm text-secondary-600 mb-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Updated {formatDate(draft.updatedAt || draft.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>{getWordCount(draft.content)} words</span>
                        </div>
                    </div>

                    {/* Excerpt */}
                    {draft.excerpt && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-secondary-800 mb-2">Excerpt</h3>
                            <p className="text-secondary-700 leading-relaxed">
                                {draft.excerpt}
                            </p>
                        </div>
                    )}

                    {/* Content Preview */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-secondary-800 mb-2">Content Preview</h3>
                        <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200 max-h-60 overflow-y-auto">
                            <p className="text-secondary-700 leading-relaxed whitespace-pre-wrap">
                                {draft.content.substring(0, 500)}
                                {draft.content.length > 500 && '...'}
                            </p>
                        </div>
                    </div>

                    {/* Slug */}
                    {draft.slug && (
                        <div className="mb-6 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                            <h3 className="text-sm font-semibold text-secondary-700 mb-1">Slug</h3>
                            <code className="text-sm text-primary-600 font-mono">
                                /{draft.slug}
                            </code>
                        </div>
                    )}

                    {/* Scheduled Date */}
                    {draft.scheduledAt && (
                        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <h3 className="text-sm font-semibold text-purple-700 mb-1">Scheduled For</h3>
                            <p className="text-purple-600">{formatDate(draft.scheduledAt)}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-secondary-200">
                        <button
                            onClick={() => {
                                onEdit(draft);
                                onClose();
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            <Edit className="w-5 h-5" />
                            <span>Edit Draft</span>
                        </button>

                        <button
                            onClick={handleDelete}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-danger-500 text-danger-600 font-medium rounded-lg hover:bg-danger-500 hover:text-white transition-all duration-300"
                        >
                            <Trash2 className="w-5 h-5" />
                            <span>Delete Draft</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
