'use client';

import React, { useEffect, useState } from 'react';
import { Report, ReportStatus, UpdateReportRequest } from '@/redux/types/report/reports.types';
import { ReportStatusBadge } from './ReportStatusBadge';
import { TargetTypeBadge } from './TargetTypeBadge';
import { X, Save, Trash2, AlertCircle, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

interface ReportDetailModalProps {
    report: Report | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (id: string, data: UpdateReportRequest) => Promise<void>;
    onAccept?: (report: Report) => Promise<void>;
    onReject?: (report: Report) => Promise<void>;
    moderatorId: string;
    isLoading?: boolean;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
    report,
    isOpen,
    onClose,
    onUpdate,
    onAccept,
    onReject,
    moderatorId,
    isLoading = false,
}) => {
    const [status, setStatus] = useState<ReportStatus>(report?.status ?? ReportStatus.OPEN);
    const [resolutionNotes, setResolutionNotes] = useState(report?.resolution_notes || '');
    const [isActionInProgress, setIsActionInProgress] = useState(false);

    // Only show a link to the post to avoid error UI when post is missing
    const postId = report?.target_type === 'post' && report?.post_id ? report.post_id : null;

    useEffect(() => {
        if (isOpen && report) {
            setStatus(report.status);
            setResolutionNotes(report.resolution_notes || '');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, report?.id]);

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

    if (!isOpen || !report) return null;

    const handleAccept = async () => {
        if (!report || !onAccept) return;
        
        setIsActionInProgress(true);
        try {
            await onAccept(report);
            onClose();
        } catch (error) {
            console.error('Failed to accept report:', error);
            alert('Failed to accept report. Please try again.');
        } finally {
            setIsActionInProgress(false);
        }
    };

    const handleReject = async () => {
        if (!report || !onReject) return;
        
        setIsActionInProgress(true);
        try {
            await onReject(report);
            onClose();
        } catch (error) {
            console.error('Failed to reject report:', error);
            alert('Failed to reject report. Please try again.');
        } finally {
            setIsActionInProgress(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={isLoading ? undefined : onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scale-in">
                <div className="sticky top-0 z-10 bg-white border-b border-secondary-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-secondary-900">Report Details</h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading || isActionInProgress}
                        className="p-2 hover:bg-secondary-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                        <ReportStatusBadge status={report.status} />
                        <TargetTypeBadge targetType={report.target_type} />
                    </div>

                    {/* Reason */}
                    <div>
                        <h3 className="text-sm font-semibold text-secondary-700 mb-2">Reason</h3>
                        <p className="text-lg font-bold text-secondary-900">{report.reason}</p>
                    </div>

                    {/* Description */}
                    {report.description && (
                        <div>
                            <h3 className="text-sm font-semibold text-secondary-700 mb-2">Description</h3>
                            <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                                <p className="text-secondary-700 leading-relaxed whitespace-pre-wrap">
                                    {report.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Post Details (if report is about a post) */}
                    {report.target_type === 'post' && (
                        <div className="border-t border-secondary-200 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-secondary-900">Reported Post</h3>
                                {postId && (
                                    <a
                                        href={`/posts/${postId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>View Post</span>
                                    </a>
                                )}
                            </div>
                            {!postId && (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                                    <p>Post ID is missing for this report.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reporter Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-secondary-700 mb-3">Reporter Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-secondary-50 rounded-lg">
                                <p className="text-xs text-secondary-500 font-semibold mb-1">Reported By</p>
                                <p className="text-secondary-900">{report.reporter?.name || 'Unknown'}</p>
                                {report.reporter?.email && (
                                    <p className="text-xs text-secondary-500">{report.reporter.email}</p>
                                )}
                            </div>
                            <div className="p-3 bg-secondary-50 rounded-lg">
                                <p className="text-xs text-secondary-500 font-semibold mb-1">Reported On</p>
                                <p className="text-secondary-900 text-sm">{formatDate(report.created_at)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Moderator Info */}
                    {report.moderator && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs text-blue-600 font-semibold mb-1">Currently Assigned To Moderator</p>
                            <p className="text-blue-900">{report.moderator.name}</p>
                        </div>
                    )}

                    {/* Action Buttons - For accepting/rejecting the report */}
                    {report.status === ReportStatus.OPEN || report.status === ReportStatus.IN_REVIEW ? (
                        <div className="flex gap-3 pt-4 border-t border-secondary-200">
                            <button
                                type="button"
                                onClick={handleReject}
                                disabled={isActionInProgress}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-500 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-all duration-300 disabled:opacity-50"
                            >
                                {isActionInProgress ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-5 h-5" />
                                        <span>Reject Report</span>
                                    </>
                                )}
                            </button>
                            {report.target_type === 'post' && (
                                <button
                                    type="button"
                                    onClick={handleAccept}
                                    disabled={isActionInProgress}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-green-600 to-green-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                                >
                                    {isActionInProgress ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span>Accept & Remove Post</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p>This report has already been processed. Edit status and notes below if needed.</p>
                        </div>
                    )}

                    {/* Advanced Options for updating report status manually */}
                    <div className="border-t border-secondary-200 pt-6">
                        <h3 className="text-lg font-bold text-secondary-900 mb-4">Advanced Options</h3>
                        
                        {/* Status Update */}
                        <div className="mb-4">
                            <label htmlFor="status" className="block text-sm font-semibold text-secondary-700 mb-2">
                                Update Status
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as ReportStatus)}
                                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 cursor-pointer"
                                disabled={isLoading || isActionInProgress}
                            >
                                <option value={ReportStatus.OPEN}>Open</option>
                                <option value={ReportStatus.IN_REVIEW}>In Review</option>
                                <option value={ReportStatus.RESOLVED}>Resolved</option>
                                <option value={ReportStatus.REJECTED}>Rejected</option>
                            </select>
                        </div>

                        {/* Resolution Notes */}
                        <div>
                            <label htmlFor="resolutionNotes" className="block text-sm font-semibold text-secondary-700 mb-2">
                                Resolution Notes
                            </label>
                            <textarea
                                id="resolutionNotes"
                                value={resolutionNotes}
                                onChange={(e) => setResolutionNotes(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 resize-none"
                                placeholder="Add notes about the resolution..."
                                disabled={isLoading || isActionInProgress}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    await onUpdate(report.id, {
                                        status,
                                        moderator_id: moderatorId,
                                        resolution_notes: resolutionNotes || undefined,
                                    });
                                    onClose();
                                } catch (error) {
                                    console.error('Failed to update report:', error);
                                }
                            }}
                            disabled={isLoading || isActionInProgress}
                            className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-primary-600 to-accent-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>Update Report</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
