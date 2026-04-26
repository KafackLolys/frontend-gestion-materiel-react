// features/loans/hooks/useLoans.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../services/api";


export const useLoans = () => {
  return useQuery({
    queryKey: ["loans"],
    queryFn: async () => {
      const { data } = await api.get("/loans");
      return data;
    },
  });
};