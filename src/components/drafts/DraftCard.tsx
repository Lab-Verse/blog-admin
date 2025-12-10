import React from 'react';
import Image from 'next/image';
import { Draft, DraftStatus } from '@/redux/types/draft/drafts.types';
import { StatusBadge } from './StatusBadge';
import { Edit, Trash2, Eye, Calendar, Clock } from 'lucide-react';

interface DraftCardProps {
    draft: Draft;
    onEdit: (draft: Draft) => void;
    onDelete: (id: string) => void;
    onView: (draft: Draft) => void;
}

export const DraftCard: React.FC<DraftCardProps> = ({
    draft,
    onEdit,
    onDelete,
    onView,
}) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this draft?')) {
            onDelete(draft.id);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getWordCount = (content: string) => {
        return content.trim().split(/\s+/).length;
    };

    const defaultImage = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80';

    return (
        <div
            onClick={() => onView(draft)}
            className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer card-hover fade-in"
        >
            {/* Cover Image with Gradient Overlay */}
            <div className="relative h-48 overflow-hidden bg-linear-to-br from-primary-400 to-purple-500">
                <Image
                    src={draft.coverImageUrl || defaultImage}
                    alt={draft.title || 'Draft'}
                    width={400}
                    height={192}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.currentTarget.src = defaultImage;
                    }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                    <StatusBadge status={draft.status} />
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(draft);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-primary-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                        aria-label="Edit draft"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-danger-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                        aria-label="Delete draft"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Title */}
                <h3 className="text-lg font-bold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
                    {draft.title || 'Untitled Draft'}
                </h3>

                {/* Excerpt */}
                {draft.excerpt && (
                    <p className="text-sm text-secondary-600 mb-4 line-clamp-2">
                        {draft.excerpt}
                    </p>
                )}

                {/* Scheduled Date (if scheduled) */}
                {draft.status === DraftStatus.SCHEDULED && draft.scheduledAt && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-medium text-purple-700">
                            Scheduled for {formatDate(draft.scheduledAt)}
                        </span>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                    <div className="flex items-center gap-4 text-xs text-secondary-500">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(draft.updatedAt || draft.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-medium">{getWordCount(draft.content)}</span>
                            <span>words</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                    </div>
                </div>
            </div>

            {/* Glassmorphism Hover Effect */}
            <div className="absolute inset-0 bg-linear-to-br from-primary-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
    );
};
