// src/types/incident.ts
export interface Incident {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export type IncidentSortColumn = "title" | "created_at";

export type IncidentsApiResponse = {
  data: Incident[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    search: string | null;
    sort_by: string;
    order: string;
  };
  status: number;
  success: boolean;
};