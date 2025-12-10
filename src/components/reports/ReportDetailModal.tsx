'use client';

import React, { useEffect, useState } from 'react';
import { Report, ReportStatus, UpdateReportRequest } from '@/redux/types/report/reports.types';
import { ReportStatusBadge } from './ReportStatusBadge';
import { TargetTypeBadge } from './TargetTypeBadge';
import { X, Save } from 'lucide-react';

interface ReportDetailModalProps {
    report: Report | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (id: string, data: UpdateReportRequest) => Promise<void>;
    moderatorId: string;
    isLoading?: boolean;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
    report,
    isOpen,
    onClose,
    onUpdate,
    moderatorId,
    isLoading = false,
}) => {
    const [status, setStatus] = useState<ReportStatus>(report?.status ?? ReportStatus.OPEN);
    const [resolutionNotes, setResolutionNotes] = useState(report?.resolution_notes || '');

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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

            <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scale-in">
                <div className="sticky top-0 z-10 bg-white border-b border-secondary-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-secondary-900">Report Details</h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-2 hover:bg-secondary-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

                    {/* Reporter Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-semibold text-secondary-700 mb-2">Reported By</h3>
                            <p className="text-secondary-900">{report.reporter?.name || 'Unknown'}</p>
                            {report.reporter?.email && (
                                <p className="text-sm text-secondary-500">{report.reporter.email}</p>
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-secondary-700 mb-2">Reported On</h3>
                            <p className="text-secondary-900">{formatDate(report.created_at)}</p>
                        </div>
                    </div>

                    {/* Moderator Info */}
                    {report.moderator && (
                        <div>
                            <h3 className="text-sm font-semibold text-secondary-700 mb-2">Moderator</h3>
                            <p className="text-secondary-900">{report.moderator.name}</p>
                        </div>
                    )}

                    {/* Status Update */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-semibold text-secondary-700 mb-2">
                            Update Status
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as ReportStatus)}
                            className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 cursor-pointer"
                            disabled={isLoading}
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
                            disabled={isLoading}
                        />
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
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-primary-600 to-accent-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
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
                </form>
            </div>
        </div>
    );
};
