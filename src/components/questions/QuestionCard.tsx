import React from 'react';
import { Question } from '@/redux/types/question/questions.types';
import { QuestionStatusBadge } from './QuestionStatusBadge';
import { CategoryBadge } from './CategoryBadge';
import { Edit, Trash2, Eye, Calendar, User } from 'lucide-react';

interface QuestionCardProps {
    question: Question;
    onEdit: (question: Question) => void;
    onDelete: (id: string) => void;
    onView: (question: Question) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    onEdit,
    onDelete,
    onView,
}) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this question?')) {
            onDelete(question.id);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div
            onClick={() => onView(question)}
            className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer card-hover fade-in p-6"
        >
            {/* Header with Badges */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex flex-wrap gap-2">
                    <QuestionStatusBadge status={question.status} />
                    <CategoryBadge categoryName={question.category?.name} />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(question);
                        }}
                        className="p-2 bg-secondary-100 rounded-lg hover:bg-primary-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                        aria-label="Edit question"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 bg-secondary-100 rounded-lg hover:bg-danger-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                        aria-label="Delete question"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-secondary-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
                {question.title}
            </h3>

            {/* Content Preview */}
            <p className="text-sm text-secondary-600 mb-4 line-clamp-3">
                {question.content}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                <div className="flex items-center gap-4 text-xs text-secondary-500">
                    {question.user?.name && (
                        <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            <span>{question.user.name}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(question.created_at)}</span>
                    </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                </div>
            </div>

            {/* Glassmorphism Hover Effect */}
            <div className="absolute inset-0 bg-linear-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
        </div>
    );
};
