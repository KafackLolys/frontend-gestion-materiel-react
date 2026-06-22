// src/types/activity-log.ts

export interface ActivityLog {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export type ActivityLogsApiResponse = {
  data: ActivityLog[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  filters: {
    search: string | null;
    sort_by: string;
    order: string;
  };
  status: number;
  success: boolean;
};
