// src/services/activity-log-service.ts
import type { ActivityLogsApiResponse } from "@/types/activity-log";
import { api } from "./api";

export const getActivityLogs = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: "title" | "created_at";
  order?: "asc" | "desc";
}): Promise<ActivityLogsApiResponse> => {
  const response = await api.get("/activity-logs", { params });
  return response.data;
};
