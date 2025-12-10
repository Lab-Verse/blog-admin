'use client';

import React, { useEffect, useState } from 'react';
import { Question, QuestionStatus, CreateQuestionRequest, UpdateQuestionRequest } from '@/redux/types/question/questions.types';
import { X, Save } from 'lucide-react';

interface QuestionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateQuestionRequest | UpdateQuestionRequest) => Promise<void>;
    question?: Question | null;
    isLoading?: boolean;
    userId: string; // Current user ID for creating questions
}

export const QuestionFormModal: React.FC<QuestionFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    question,
    isLoading = false,
    userId,
}) => {
    const getInitialFormData = (): CreateQuestionRequest => {
        if (question) {
            return {
                user_id: question.user_id,
                title: question.title,
                slug: question.slug,
                content: question.content,
                category_id: question.category_id,
                status: question.status,
            };
        }
        return {
            user_id: userId,
            title: '',
            slug: '',
            content: '',
            category_id: '',
            status: QuestionStatus.OPEN,
        };
    };

    const [formData, setFormData] = useState<CreateQuestionRequest>(() => getInitialFormData());
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form only when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData(getInitialFormData());
            setErrors({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, question, userId]);

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

        if (!formData.category_id.trim()) {
            newErrors.category_id = 'Category is required';
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
            console.error('Failed to save question:', error);
        }
    };

    const handleChange = (field: keyof CreateQuestionRequest, value: string | QuestionStatus) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
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
            <div onClick={isLoading ? undefined : onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scale-in">
                <div className="sticky top-0 z-10 bg-white border-b border-secondary-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-secondary-900">
                        {question ? 'Edit Question' : 'Ask a Question'}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-2 hover:bg-secondary-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

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
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${errors.title ? 'border-danger-500 focus:ring-danger-500' : 'border-secondary-200 focus:ring-primary-500'
                                }`}
                            placeholder="What's your question?"
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

                    {/* Content */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-semibold text-secondary-700 mb-2">
                            Content <span className="text-danger-500">*</span>
                        </label>
                        <textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => handleChange('content', e.target.value)}
                            rows={8}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${errors.content ? 'border-danger-500 focus:ring-danger-500' : 'border-secondary-200 focus:ring-primary-500'
                                }`}
                            placeholder="Provide details about your question..."
                            disabled={isLoading}
                        />
                        {errors.content && <p className="mt-1 text-sm text-danger-600">{errors.content}</p>}
                    </div>

                    {/* Category ID */}
                    <div>
                        <label htmlFor="category_id" className="block text-sm font-semibold text-secondary-700 mb-2">
                            Category ID <span className="text-danger-500">*</span>
                        </label>
                        <input
                            id="category_id"
                            type="text"
                            value={formData.category_id}
                            onChange={(e) => handleChange('category_id', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${errors.category_id ? 'border-danger-500 focus:ring-danger-500' : 'border-secondary-200 focus:ring-primary-500'
                                }`}
                            placeholder="Enter category ID"
                            disabled={isLoading}
                        />
                        {errors.category_id && <p className="mt-1 text-sm text-danger-600">{errors.category_id}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-semibold text-secondary-700 mb-2">
                            Status
                        </label>
                        <select
                            id="status"
                            value={formData.status}
                            onChange={(e) => handleChange('status', e.target.value as QuestionStatus)}
                            className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 cursor-pointer"
                            disabled={isLoading}
                        >
                            <option value={QuestionStatus.OPEN}>Open</option>
                            <option value={QuestionStatus.CLOSED}>Closed</option>
                            <option value={QuestionStatus.ARCHIVED}>Archived</option>
                        </select>
                    </div>

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
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-accent-600 to-primary-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>{question ? 'Update Question' : 'Post Question'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
