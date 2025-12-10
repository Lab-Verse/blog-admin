import { baseApi } from '../baseApi';
import {
    DashboardData,
    GetDashboardDataQuery,
    DashboardStats,
    ActivityItem,
} from '@/redux/types/dashboard/dashboard.types';

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
    }),
});

export const {
    useGetDashboardDataQuery,
    useGetDashboardStatsQuery,
    useGetRecentActivityQuery,
} = dashboardApi;
