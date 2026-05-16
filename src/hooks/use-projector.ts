import { useQuery } from "@tanstack/react-query";
import type { ProjectorsApiResponse } from "@/types/projector";
import { getProjectors } from "@/services/projector-service";


export type ProjectorSortColumn = "ref" | "marque" | "description" | "etat" | "disponible" | "created_at";

export const useProjectors = (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: ProjectorSortColumn;
  order?: "asc" | "desc";
}) => {
  const query = useQuery<ProjectorsApiResponse, Error>({
    queryKey: ["projectors", params],
    queryFn: () => getProjectors(params),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  return {
    ...query,
    projectors: query.data?.data ?? [],
    meta: query.data?.meta,
    filters: query.data?.filters,
  };
};