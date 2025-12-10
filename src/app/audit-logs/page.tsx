'use client';

import React, { useState, useEffect } from 'react';
import AuditLogsPage from '@/components/audit-logs/pages/AuditLogsPage';
import { useGetAuditLogsQuery } from '@/redux/api/auditlog/auditLogsApi';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectAuditLogsList,
    selectAuditLogsLoading,
    selectAuditLogsTotal,
    selectAuditLogsPage,
    selectAuditLogsLimit,
} from '@/redux/selectors/auditlog/auditLogsSelectors';
import { setAuditLogsPage } from '@/redux/slices/auditlog/auditLogsSlice';
import { GetAuditLogsQuery } from '@/redux/types/auditlog/auditLogs.types';

export default function Page() {
    const dispatch = useDispatch();
    const [filters, setFilters] = useState<GetAuditLogsQuery>({});

    const page = useSelector(selectAuditLogsPage);
    const limit = useSelector(selectAuditLogsLimit);

    // Fetch audit logs with pagination and filters
    useGetAuditLogsQuery({ page, limit, ...filters });

    const logs = useSelector(selectAuditLogsList);
    const isLoading = useSelector(selectAuditLogsLoading);
    const total = useSelector(selectAuditLogsTotal);

    const handlePageChange = (newPage: number) => {
        dispatch(setAuditLogsPage(newPage));
    };

    const handleFilterChange = (newFilters: GetAuditLogsQuery) => {
        setFilters(newFilters);
        // Reset to page 1 when filters change
        dispatch(setAuditLogsPage(1));
    };

    return (
        <AuditLogsPage
            logs={logs}
            isLoading={isLoading}
            total={total}
            page={page}
            limit={limit}
            onPageChange={handlePageChange}
            onFilterChange={handleFilterChange}
        />
    );
}
