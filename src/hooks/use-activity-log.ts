// src/hooks/use-activity-log.ts
import { useQuery } from "@tanstack/react-query";
import { getActivityLogs } from "../services/activity-log-service";
import type { ActivityLogsApiResponse } from "@/types/activity-log";

export type LogSortColumn = "title" | "created_at";

export const useActivityLogs = (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: LogSortColumn;
  order?: "asc" | "desc";
}) => {
  const query = useQuery<ActivityLogsApiResponse, Error>({
    queryKey: ["activity-logs", params],
    queryFn: () => getActivityLogs(params),
    staleTime: 1 * 60 * 1000,
    retry: 1,
  });

  return {
    ...query,
    logs: query.data?.data ?? [],
    meta: query.data?.meta,
    filters: query.data?.filters,
  };
};
