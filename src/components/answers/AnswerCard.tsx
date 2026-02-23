import React from 'react';
import { Answer } from '@/redux/types/answer/answers.types';
import { AnswerStatusBadge } from './AnswerStatusBadge';
import { Edit, Trash2, ThumbsUp, ThumbsDown, CheckCircle, Calendar } from 'lucide-react';

interface AnswerCardProps {
    answer: Answer;
    onEdit: (answer: Answer) => void;
    onDelete: (id: string) => void;
    onToggleAccepted?: (answer: Answer) => void;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
    answer,
    onEdit,
    onDelete,
    onToggleAccepted,
}) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this answer?')) {
            onDelete(answer.id);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const voteScore = answer.upvotes - answer.downvotes;

    return (
        <div className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 card-hover fade-in p-6">
            {/* Header with Badges and Actions */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex flex-wrap gap-2">
                    <AnswerStatusBadge status={answer.status} />
                    {answer.isAccepted && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-500 text-white border border-accent-600">
                            <CheckCircle className="w-3.5 h-3.5 fill-white" />
                            Accepted
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(answer);
                        }}
                        className="p-2 bg-secondary-100 rounded-lg hover:bg-primary-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                        aria-label="Edit answer"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 bg-secondary-100 rounded-lg hover:bg-danger-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                        aria-label="Delete answer"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            {answer.question?.title && (
                <p className="text-sm font-medium text-primary-700 mb-2">
                    Question: {answer.question.title}
                </p>
            )}
            <p className="text-secondary-700 mb-4 line-clamp-4 leading-relaxed">
                {answer.content}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                <div className="flex items-center gap-4">
                    {/* Vote Score */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${voteScore > 0 ? 'bg-accent-50 text-accent-700' :
                            voteScore < 0 ? 'bg-danger-50 text-danger-700' :
                                'bg-secondary-100 text-secondary-600'
                        }`}>
                        <ThumbsUp className="w-4 h-4" />
                        <span className="font-semibold">{answer.upvotes}</span>
                        <span className="text-xs">|</span>
                        <ThumbsDown className="w-4 h-4" />
                        <span className="font-semibold">{answer.downvotes}</span>
                    </div>

                    {/* Date */}
                    {answer.createdAt && (
                        <div className="flex items-center gap-1 text-xs text-secondary-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(answer.createdAt)}</span>
                        </div>
                    )}
                </div>

                {/* Accept Button */}
                {onToggleAccepted && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleAccepted(answer);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${answer.isAccepted
                                ? 'bg-accent-500 text-white hover:bg-accent-600'
                                : 'bg-secondary-100 text-secondary-700 hover:bg-accent-100 hover:text-accent-700'
                            }`}
                    >
                        <CheckCircle className={`w-4 h-4 ${answer.isAccepted ? 'fill-white' : ''}`} />
                        <span>{answer.isAccepted ? 'Accepted' : 'Mark as Accepted'}</span>
                    </button>
                )}
            </div>

            {/* Glassmorphism Hover Effect */}
            <div className="absolute inset-0 bg-linear-to-br from-accent-500/5 to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
        </div>
    );
};
