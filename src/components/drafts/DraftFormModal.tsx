'use client';

import React, { useEffect, useState } from 'react';
import { Draft, DraftStatus, CreateDraftDto, UpdateDraftDto } from '@/redux/types/draft/drafts.types';
import { X, Save } from 'lucide-react';

interface DraftFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateDraftDto | UpdateDraftDto) => Promise<void>;
    draft?: Draft | null;
    isLoading?: boolean;
}

export const DraftFormModal: React.FC<DraftFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    draft,
    isLoading = false,
}) => {
    const getInitialFormData = (): CreateDraftDto => {
        if (draft) {
            return {
                title: draft.title || '',
                content: draft.content || '',
                slug: draft.slug || '',
                excerpt: draft.excerpt || '',
                coverImageUrl: draft.coverImageUrl || '',
                status: draft.status || DraftStatus.DRAFT,
                scheduledAt: draft.scheduledAt || null,
            };
        }
        return {
            title: '',
            content: '',
            slug: '',
            excerpt: '',
            coverImageUrl: '',
            status: DraftStatus.DRAFT,
            scheduledAt: null,
        };
    };

    const [formData, setFormData] = useState<CreateDraftDto>(getInitialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Close on ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isLoading) onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose, isLoading]);

    if (!isOpen) return null;

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Content is required';
        }

        if (formData.status === DraftStatus.SCHEDULED && !formData.scheduledAt) {
            newErrors.scheduledAt = 'Scheduled date is required for scheduled drafts';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Failed to save draft:', error);
        }
    };

    const handleChange = (field: keyof CreateDraftDto, value: CreateDraftDto[keyof CreateDraftDto]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                onClick={isLoading ? undefined : onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <div key={`${isOpen}-${draft?.id || 'new'}`} className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scale-in">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-secondary-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-secondary-900">
                        {draft ? 'Edit Draft' : 'Create New Draft'}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-2 hover:bg-secondary-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-secondary-700 mb-2">
                            Title <span className="text-danger-500">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${errors.title
                                ? 'border-danger-500 focus:ring-danger-500'
                                : 'border-secondary-200 focus:ring-primary-500'
                                }`}
                            placeholder="Enter draft title..."
                            disabled={isLoading}
                        />
                        {errors.title && <p className="mt-1 text-sm text-danger-600">{errors.title}</p>}
                    </div>

                    {/* Slug */}
                    <div>
                        <label htmlFor="slug" className="block text-sm font-semibold text-secondary-700 mb-2">
                            Slug
                        </label>
                        <input
                            id="slug"
                            type="text"
                            value={formData.slug}
                            onChange={(e) => handleChange('slug', e.target.value)}
                            className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                            placeholder="url-friendly-slug"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label htmlFor="excerpt" className="block text-sm font-semibold text-secondary-700 mb-2">
                            Excerpt
                        </label>
                        <textarea
                            id="excerpt"
                            value={formData.excerpt}
                            onChange={(e) => handleChange('excerpt', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 resize-none"
                            placeholder="Brief description..."
                            disabled={isLoading}
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-semibold text-secondary-700 mb-2">
                            Content <span className="text-danger-500">*</span>
                        </label>
                        <textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => handleChange('content', e.target.value)}
                            rows={10}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${errors.content
                                ? 'border-danger-500 focus:ring-danger-500'
                                : 'border-secondary-200 focus:ring-primary-500'
                                }`}
                            placeholder="Write your content here..."
                            disabled={isLoading}
                        />
                        {errors.content && <p className="mt-1 text-sm text-danger-600">{errors.content}</p>}
                    </div>

                    {/* Cover Image URL */}
                    <div>
                        <label htmlFor="coverImageUrl" className="block text-sm font-semibold text-secondary-700 mb-2">
                            Cover Image URL
                        </label>
                        <input
                            id="coverImageUrl"
                            type="url"
                            value={formData.coverImageUrl}
                            onChange={(e) => handleChange('coverImageUrl', e.target.value)}
                            className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                            placeholder="https://example.com/image.jpg"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-semibold text-secondary-700 mb-2">
                            Status
                        </label>
                        <select
                            id="status"
                            value={formData.status}
                            onChange={(e) => handleChange('status', e.target.value as DraftStatus)}
                            className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 cursor-pointer"
                            disabled={isLoading}
                        >
                            <option value={DraftStatus.DRAFT}>Draft</option>
                            <option value={DraftStatus.SCHEDULED}>Scheduled</option>
                            <option value={DraftStatus.ARCHIVED}>Archived</option>
                        </select>
                    </div>

                    {/* Scheduled Date (only if status is SCHEDULED) */}
                    {formData.status === DraftStatus.SCHEDULED && (
                        <div>
                            <label htmlFor="scheduledAt" className="block text-sm font-semibold text-secondary-700 mb-2">
                                Scheduled Date <span className="text-danger-500">*</span>
                            </label>
                            <input
                                id="scheduledAt"
                                type="datetime-local"
                                value={formData.scheduledAt ? new Date(formData.scheduledAt).toISOString().slice(0, 16) : ''}
                                onChange={(e) => handleChange('scheduledAt', e.target.value ? new Date(e.target.value).toISOString() : null)}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${errors.scheduledAt
                                    ? 'border-danger-500 focus:ring-danger-500'
                                    : 'border-secondary-200 focus:ring-primary-500'
                                    }`}
                                disabled={isLoading}
                            />
                            {errors.scheduledAt && <p className="mt-1 text-sm text-danger-600">{errors.scheduledAt}</p>}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-secondary-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 bg-white border border-secondary-300 text-secondary-700 font-medium rounded-lg hover:bg-secondary-50 transition-all duration-300 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>{draft ? 'Update Draft' : 'Create Draft'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
