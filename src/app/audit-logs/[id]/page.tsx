'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetAuditLogByIdQuery } from '@/redux/api/auditlog/auditLogsApi';
import AuditLogDetails from '@/components/audit-logs/ui/AuditLogDetails';
import { Button } from '@/components/ui/button';

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: log, isLoading, error } = useGetAuditLogByIdQuery(id);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-blue-600 rounded-full opacity-20 animate-ping"></div>
                        </div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Loading audit log...</p>
                </div>
            </div>
        );
    }

    if (error || !log) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-12 h-12 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Audit Log Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        The audit log you're looking for doesn't exist or has been removed.
                    </p>
                    <Button onClick={() => router.push('/audit-logs')}>
                        Back to Audit Logs
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/audit-logs')}
                        className="flex items-center gap-2"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back to Audit Logs
                    </Button>
                </div>

                {/* Details */}
                <AuditLogDetails log={log} />
            </div>
        </div>
    );
}

