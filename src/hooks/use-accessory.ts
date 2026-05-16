import { useQuery } from "@tanstack/react-query";
import type { AccessoriesApiResponse } from "@/types/accessory";
import { getAccessories } from "@/services/accessory-service";

export type AccessorySortColumn = "name" | "quantity" | "created_at";

export const useAccessories = (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: AccessorySortColumn;
  order?: "asc" | "desc";
}) => {
  const query = useQuery<AccessoriesApiResponse, Error>({
    queryKey: ["accessories", params],
    queryFn: () => getAccessories(params),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  return {
    ...query,
    accessories: query.data?.data ?? [],
    meta: query.data?.meta,
    filters: query.data?.filters,
  };
};
