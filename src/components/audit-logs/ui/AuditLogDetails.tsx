'use client';

import React from 'react';
import { AuditLog } from '@/redux/types/auditlog/auditLogs.types';
import AuditActionBadge from './AuditActionBadge';
import AuditEntityBadge from './AuditEntityBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AuditLogDetailsProps {
    log: AuditLog;
}

export default function AuditLogDetails({ log }: AuditLogDetailsProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <Card className="border-0 shadow-xl ring-1 ring-gray-200/50">
                <CardHeader className="bg-linear-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            Audit Log Details
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <AuditActionBadge action={log.action} />
                            {log.entityType && <AuditEntityBadge entityType={log.entityType} />}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Log ID */}
                        <div>
                            <div className="text-sm font-semibold text-gray-500 mb-1">Log ID</div>
                            <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
                                {log.id}
                            </div>
                        </div>

                        {/* User ID */}
                        <div>
                            <div className="text-sm font-semibold text-gray-500 mb-1">User ID</div>
                            <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
                                {log.userId}
                            </div>
                        </div>

                        {/* Entity ID */}
                        <div>
                            <div className="text-sm font-semibold text-gray-500 mb-1">Entity ID</div>
                            <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
                                {log.entityId}
                            </div>
                        </div>

                        {/* Timestamp */}
                        <div>
                            <div className="text-sm font-semibold text-gray-500 mb-1">Timestamp</div>
                            <div className="text-sm text-gray-900 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
                                {log.createdAt ? formatDate(log.createdAt) : 'Unknown'}
                            </div>
                        </div>

                        {/* IP Address */}
                        {log.ipAddress && (
                            <div>
                                <div className="text-sm font-semibold text-gray-500 mb-1">IP Address</div>
                                <div className="font-mono text-sm text-gray-900 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 flex items-center gap-2">
                                    <span>🌐</span>
                                    {log.ipAddress}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* User Agent Card */}
            {log.userAgent && (
                <Card className="border-0 shadow-xl ring-1 ring-gray-200/50">
                    <CardHeader className="bg-gray-50 border-b border-gray-100">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            User Agent
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="font-mono text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200 break-all">
                            {log.userAgent}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Changes Card */}
            {!!(log.metadata?.oldValues || log.metadata?.newValues) && (
                <Card className="border-0 shadow-xl ring-1 ring-gray-200/50">
                    <CardHeader className="bg-gray-50 border-b border-gray-100">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            Changes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Old Values */}
                            {log.metadata?.oldValues && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                            Old Values
                                        </div>
                                    </div>
                                    <pre className="text-xs bg-red-50 p-4 rounded-lg border-2 border-red-200 overflow-x-auto font-mono text-gray-800">
                                        {JSON.stringify(log.metadata.oldValues, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {/* New Values */}
                            {log.metadata?.newValues && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                            New Values
                                        </div>
                                    </div>
                                    <pre className="text-xs bg-green-50 p-4 rounded-lg border-2 border-green-200 overflow-x-auto font-mono text-gray-800">
                                        {JSON.stringify(log.metadata.newValues, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
