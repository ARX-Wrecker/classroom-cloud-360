import { useQuery } from '@tanstack/react-query';
import { dashboardApi, notificationsApi } from '@/lib/api';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await dashboardApi.stats();
      // backend: { success, data: { role, stats, recent_users, popular_courses, ... } }
      return data?.data ?? data;
    },
    staleTime: 60_000,
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await notificationsApi.list();
      return data?.data ?? [];
    },
    refetchInterval: 60_000,
    retry: false,
  });
}
