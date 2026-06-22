// src/hooks/use-incident.ts
import { useQuery } from "@tanstack/react-query";
import type { IncidentsApiResponse, IncidentSortColumn } from "@/types/incident";
import { getIncidents } from "@/services/incident-service";

export type { IncidentSortColumn };

export const useIncidents = (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: IncidentSortColumn;
  order?: "asc" | "desc";
}) => {
  const query = useQuery<IncidentsApiResponse, Error>({
    queryKey: ["incidents", params],
    queryFn: () => getIncidents(params),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  return {
    ...query,
    incidents: query.data?.data ?? [],
    meta: query.data?.meta,
    filters: query.data?.filters,
  };
};