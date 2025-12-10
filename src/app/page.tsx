'use client';

import DashboardComponent from '@/components/dashboard/DashboardComponent';
import {
  useGetDashboardStatsQuery,
  useGetRecentActivityQuery,
  useGetDashboardDataQuery
} from '@/redux/api/dashboard/dashboardApi';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery(undefined, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
  });

  const { data: activity, isLoading: activityLoading } = useGetRecentActivityQuery({ limit: 5 }, {
    pollingInterval: 30000,
  });

  const { data: dashboardData, isLoading: dataLoading } = useGetDashboardDataQuery({ timeRange: '7d' }, {
    pollingInterval: 60000,
  });

  const isLoading = statsLoading || activityLoading || dataLoading;

  return (
    <DashboardComponent
      stats={stats}
      activity={activity}
      isLoading={isLoading}
    />
  );
}

