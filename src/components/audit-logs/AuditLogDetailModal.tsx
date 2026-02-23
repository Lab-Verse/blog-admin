'use client';

import React, { useEffect } from 'react';
import { X, Activity, User, Calendar, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AuditLogItem } from '@/redux/api/dashboard/dashboardApi';

interface AuditLogDetailModalProps {
    auditLog: AuditLogItem | null;
    isOpen: boolean;
    onClose: () => void;
}

const formatActionName = (action: string): string => {
    const actionMap: { [key: string]: string } = {
        'CREATE_POST': 'Created a post',
        'UPDATE_POST': 'Updated a post',
        'DELETE_POST': 'Deleted a post',
        'VIEW_POST': 'Viewed a post',
        'CREATE_COMMENT': 'Created a comment',
        'UPDATE_COMMENT': 'Updated a comment',
        'DELETE_COMMENT': 'Deleted a comment',
        'CREATE_USER': 'Created a user',
        'UPDATE_USER': 'Updated a user',
        'DELETE_USER': 'Deleted a user',
        'LOGIN': 'Logged in',
        'LOGOUT': 'Logged out',
        'CREATE_CATEGORY': 'Created a category',
        'UPDATE_CATEGORY': 'Updated a category',
        'DELETE_CATEGORY': 'Deleted a category',
        'CREATE_TAG': 'Created a tag',
        'UPDATE_TAG': 'Updated a tag',
        'DELETE_TAG': 'Deleted a tag',
        'CREATE_MEDIA': 'Uploaded media',
        'DELETE_MEDIA': 'Deleted media',
        'CREATE_DRAFT': 'Created a draft',
        'UPDATE_DRAFT': 'Updated a draft',
        'DELETE_DRAFT': 'Deleted a draft',
    };

    return actionMap[action] || action.toLowerCase().replace(/_/g, ' ');
};

export const AuditLogDetailModal: React.FC<AuditLogDetailModalProps> = ({
    auditLog,
    isOpen,
    onClose,
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

    if (!isOpen || !auditLog) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Audit Log Details</h2>
                            <p className="text-sm text-slate-500">Activity information</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Action */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Action
                        </label>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs font-mono">
                                {auditLog.action}
                            </Badge>
                            <span className="text-slate-900">
                                {formatActionName(auditLog.action)}
                            </span>
                        </div>
                    </div>

                    {/* User */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            User
                        </label>
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <div className="font-semibold text-slate-900">
                                {auditLog.user?.name || auditLog.user?.email || 'System'}
                            </div>
                            {auditLog.user?.email && auditLog.user?.name && (
                                <div className="text-sm text-slate-600 mt-1">
                                    {auditLog.user.email}
                                </div>
                            )}
                            {auditLog.user_id && (
                                <div className="text-xs text-slate-400 mt-1 font-mono">
                                    ID: {auditLog.user_id}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Target Resource */}
                    {auditLog.auditable_type && (
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">
                                Target Resource
                            </label>
                            <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                                <div>
                                    <span className="text-xs text-slate-500 uppercase">Type</span>
                                    <div className="text-slate-900 capitalize">
                                        {auditLog.auditable_type.replace(/_/g, ' ')}
                                    </div>
                                </div>
                                {auditLog.auditable_id && (
                                    <div>
                                        <span className="text-xs text-slate-500 uppercase">ID</span>
                                        <div className="text-slate-900 font-mono text-sm">
                                            {auditLog.auditable_id}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Timestamp */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Timestamp
                        </label>
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <div className="text-slate-900">
                                {new Date(auditLog.created_at).toLocaleString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                })}
                            </div>
                        </div>
                    </div>

                    {/* IP Address */}
                    {auditLog.ip_address && (
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                IP Address
                            </label>
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <div className="text-slate-900 font-mono">
                                    {auditLog.ip_address}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Log ID */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Log ID
                        </label>
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <code className="text-xs text-slate-600 break-all">
                                {auditLog.id}
                            </code>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
