import React from 'react';
import { Report, ReportStatus } from '@/redux/types/report/reports.types';
import { ReportStatusBadge } from './ReportStatusBadge';
import { TargetTypeBadge } from './TargetTypeBadge';
import { Eye, CheckCircle, XCircle, Calendar, User } from 'lucide-react';

interface ReportCardProps {
    report: Report;
    onView: (report: Report) => void;
    onAccept?: (report: Report) => void;
    onReject?: (report: Report) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
    report,
    onView,
    onAccept,
    onReject,
}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const canTakeAction = report.status === ReportStatus.OPEN || report.status === ReportStatus.IN_REVIEW;

    const handleCardClick = () => {
        // If it's a post report, open the post directly
        if (report.target_type === 'post' && report.post_id) {
            window.open(`/posts/${report.post_id}`, '_blank');
        } else {
            // For other types, show the modal
            onView(report);
        }
    };

    return (
        <div
            onClick={handleCardClick}
            className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer card-hover fade-in p-6"
        >
            {/* Header with Badges */}
            <div className="flex flex-wrap items-start gap-2 mb-4">
                <ReportStatusBadge status={report.status} />
                <TargetTypeBadge targetType={report.target_type} />
            </div>

            {/* Reason */}
            <h3 className="text-lg font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                {report.reason}
            </h3>

            {/* Description */}
            {report.description && (
                <p className="text-sm text-secondary-600 mb-4 line-clamp-2">
                    {report.description}
                </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-secondary-500 mb-4">
                {report.reporter?.name && (
                    <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        <span>Reported by {report.reporter.name}</span>
                    </div>
                )}
                <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(report.created_at)}</span>
                </div>
            </div>

            {/* Moderator Info */}
            {report.moderator?.name && (
                <div className="text-xs text-secondary-500 mb-4 p-2 bg-secondary-50 rounded">
                    <span className="font-medium">Moderator:</span> {report.moderator.name}
                </div>
            )}

            {/* Action Buttons */}
            {canTakeAction && (onAccept || onReject) && (
                <div className="flex gap-2 pt-4 border-t border-secondary-100">
                    {onReject && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onReject(report);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-500 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
                        >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                        </button>
                    )}
                    {onAccept && report.target_type === 'post' && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAccept(report);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                        >
                            <CheckCircle className="w-4 h-4" />
                            <span>Accept</span>
                        </button>
                    )}
                </div>
            )}

            {/* View Indicator */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="p-2 bg-primary-100 rounded-lg">
                    <Eye className="w-4 h-4 text-primary-600" />
                </div>
            </div>

            {/* Glassmorphism Hover Effect */}
            <div className="absolute inset-0 bg-linear-to-br from-danger-500/5 to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
        </div>
    );
};
