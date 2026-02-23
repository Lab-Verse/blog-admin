'use client';

import React, { useEffect } from 'react';
import { Question } from '@/redux/types/question/questions.types';
import { QuestionStatusBadge } from './QuestionStatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { AnswersSection } from '../answers/AnswersSection';
import { X, Edit, Trash2, Calendar, User } from 'lucide-react';

interface QuestionDetailModalProps {
    question: Question | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (question: Question) => void;
    onDelete: (id: string) => void;
}

export const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
    question,
    isOpen,
    onClose,
    onEdit,
    onDelete,
}) => {
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

    if (!isOpen || !question) return null;

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            onDelete(question.id);
            onClose();
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scale-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-danger-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 md:p-8">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <QuestionStatusBadge status={question.status} />
                        <CategoryBadge categoryName={question.category?.name} />
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4 leading-tight">
                        {question.title}
                    </h2>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-4 text-sm text-secondary-600 mb-6 pb-6 border-b border-secondary-200">
                        {question.user?.name && (
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>Asked by {question.user.name}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(question.created_at)}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-secondary-800 mb-3">Question Details</h3>
                        <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                            <p className="text-secondary-700 leading-relaxed whitespace-pre-wrap">
                                {question.content}
                            </p>
                        </div>
                    </div>

                    {/* Slug */}
                    {question.slug && (
                        <div className="mb-6 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                            <h3 className="text-sm font-semibold text-secondary-700 mb-1">Slug</h3>
                            <code className="text-sm text-primary-600 font-mono">/{question.slug}</code>
                        </div>
                    )}

                    {/* Answers Section */}
                    <div className="mb-6 pb-6 border-t border-secondary-200 pt-6">
                        <h3 className="text-lg font-semibold text-secondary-800 mb-4">Answers</h3>
                        <AnswersSection questionId={question.id} />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-secondary-200">
                        <button
                            onClick={() => {
                                onEdit(question);
                                onClose();
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-accent-600 to-primary-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            <Edit className="w-5 h-5" />
                            <span>Edit Question</span>
                        </button>

                        <button
                            onClick={handleDelete}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-danger-500 text-danger-600 font-medium rounded-lg hover:bg-danger-500 hover:text-white transition-all duration-300"
                        >
                            <Trash2 className="w-5 h-5" />
                            <span>Delete Question</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
