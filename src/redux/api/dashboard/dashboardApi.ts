import { baseApi } from '../baseApi';
import {
    DashboardData,
    GetDashboardDataQuery,
    DashboardStats,
    ActivityItem,
} from '@/redux/types/dashboard/dashboard.types';

export interface AuditLogItem {
    id: string;
    user_id: string | null;
    action: string;
    auditable_type: string | null;
    auditable_id: string | null;
    ip_address: string | null;
    created_at: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardData: builder.query<DashboardData, GetDashboardDataQuery | undefined>({
            query: (params) => ({
                url: '/dashboard',
                params: {
                    timeRange: params?.timeRange || '7d',
                    includeCharts: params?.includeCharts !== false,
                },
            }),
            providesTags: ['Dashboard'],
            // Enable polling for real-time updates (every 30 seconds)
            keepUnusedDataFor: 30,
        }),

        getDashboardStats: builder.query<DashboardStats, void>({
            query: () => '/dashboard/stats',
            providesTags: ['Dashboard'],
        }),

        getRecentActivity: builder.query<ActivityItem[], { limit?: number }>({
            query: ({ limit = 10 }) => ({
                url: '/dashboard/activity',
                params: { limit },
            }),
            providesTags: ['Dashboard'],
        }),

        getTrafficData: builder.query<{ daily: number[] }, number | void>({
            query: (days = 30) => `/dashboard/traffic?days=${days}`,
            providesTags: ['Dashboard'],
        }),

        getDashboardAuditLogs: builder.query<AuditLogItem[], number | void>({
            query: (limit = 10) => `/dashboard/audit-logs?limit=${limit}`,
            providesTags: ['Dashboard'],
        }),
    }),
});

export const {
    useGetDashboardDataQuery,
    useGetDashboardStatsQuery,
    useGetRecentActivityQuery,
    useGetTrafficDataQuery,
    useGetDashboardAuditLogsQuery,
} = dashboardApi;
