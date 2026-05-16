import { useQuery } from "@tanstack/react-query";
import type { StatsApiResponse } from "@/types/stats";
import { getStats } from "@/services/stats-service";

export const useStats = () => {
  return useQuery<StatsApiResponse, Error>({
    queryKey: ["stats"],
    queryFn: getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
