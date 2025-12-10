'use client';

import React, { useState } from 'react';
import { AuditLog, GetAuditLogsQuery } from '@/redux/types/auditlog/auditLogs.types';
import AuditLogCard from '../ui/AuditLogCard';
import FilterPanel from '../ui/FilterPanel';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface AuditLogsPageProps {
    logs: AuditLog[];
    isLoading: boolean;
    total: number;
    page: number;
    limit: number;
    onPageChange: (page: number) => void;
    onFilterChange: (filters: GetAuditLogsQuery) => void;
}

export default function AuditLogsPage({
    logs,
    isLoading,
    total,
    page,
    limit,
    onPageChange,
    onFilterChange,
}: AuditLogsPageProps) {
    const router = useRouter();
    const [filters, setFilters] = useState<GetAuditLogsQuery>({});
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = (newFilters: GetAuditLogsQuery) => {
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({});
        onFilterChange({});
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Audit Logs</h1>
                        <p className="text-gray-600 mt-2">Track and monitor all system activities</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </div>

                {/* Stats */}
                <div className="flex gap-4">
                    <div className="bg-white px-4 py-2 rounded-lg shadow border">
                        <div className="text-2xl font-bold">{total}</div>
                        <div className="text-xs text-gray-500">Total Logs</div>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow border">
                        <div className="text-2xl font-bold">{logs.length}</div>
                        <div className="text-xs text-gray-500">Current Page</div>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <FilterPanel
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                    />
                )}

                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No audit logs found</h3>
                        <p className="text-gray-600">
                            {Object.keys(filters).length > 0
                                ? 'Try adjusting your filters'
                                : 'Audit logs will appear here'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {logs.map((log) => (
                            <div key={log.id} onClick={() => router.push(`/audit-logs/${log.id}`)}>
                                <AuditLogCard log={log} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && logs.length > 0 && totalPages > 1 && (
                    <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow border">
                        <div className="text-sm">
                            Page {page} of {totalPages}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(page - 1)}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(page + 1)}
                                disabled={page === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
