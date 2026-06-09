// features/loans/hooks/useLoans.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../services/api";
import { getAllLoans, type LoansFilters, type LoansResponse } from "@/services/loan-service";



export const useLoans = () => {
  return useQuery({
    queryKey: ["loans"],
    queryFn: async () => {
      const { data } = await api.get("/loans");
      return data;
    },
  });
};

export const useAllLoans = (filters?: LoansFilters) => {
  const query = useQuery<LoansResponse, Error>({
    queryKey: ["all-loans", filters],
    queryFn: () => getAllLoans(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
    enabled: !!localStorage.getItem("token"),
  });

  return {
    ...query,
    loans: query.data?.data ?? [],
    meta: query.data?.meta,
    filters: query.data?.filters,
  };
};