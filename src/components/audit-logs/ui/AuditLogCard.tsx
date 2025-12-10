'use client';

import React, { useState } from 'react';
import { AuditLog } from '@/redux/types/auditlog/auditLogs.types';
import AuditActionBadge from './AuditActionBadge';
import AuditEntityBadge from './AuditEntityBadge';
import { Card, CardContent } from '@/components/ui/card';

interface AuditLogCardProps {
    log: AuditLog;
}

export default function AuditLogCard({ log }: AuditLogCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const hasChanges = !!(log.metadata?.oldValues || log.metadata?.newValues);

    return (
        <Card className="border-0 shadow-md ring-1 ring-gray-200/50 hover:shadow-lg hover:ring-gray-300/50 transition-all duration-300 cursor-pointer overflow-hidden">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <AuditActionBadge action={log.action} />
                        {log.entityType && <AuditEntityBadge entityType={log.entityType} />}
                    </div>
                    <div className="text-xs text-gray-500">
                        {log.createdAt ? formatDate(log.createdAt) : 'Unknown'}
                    </div>
                </div>

                <div className="space-y-2 text-sm">
                    <div>
                        <span className="font-medium text-gray-700">User ID:</span>{' '}
                        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{log.userId}</span>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">Entity ID:</span>{' '}
                        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{log.entityId}</span>
                    </div>
                    {log.ipAddress && (
                        <div>
                            <span className="font-medium text-gray-700">IP:</span>{' '}
                            <span className="font-mono text-xs">{log.ipAddress}</span>
                        </div>
                    )}
                </div>

                {hasChanges && (
                    <div className="mt-4">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            {isExpanded ? 'Hide' : 'Show'} Changes
                        </button>
                        {isExpanded && (
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                {log.metadata?.oldValues && (
                                    <div>
                                        <div className="text-xs font-semibold text-gray-700 mb-1">Old Values</div>
                                        <pre className="text-xs bg-red-50 p-2 rounded border border-red-200 overflow-x-auto">
                                            {JSON.stringify(log.metadata.oldValues, null, 2)}
                                        </pre>
                                    </div>
                                )}
                                {log.metadata?.newValues && (
                                    <div>
                                        <div className="text-xs font-semibold text-gray-700 mb-1">New Values</div>
                                        <pre className="text-xs bg-green-50 p-2 rounded border border-green-200 overflow-x-auto">
                                            {JSON.stringify(log.metadata.newValues, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
