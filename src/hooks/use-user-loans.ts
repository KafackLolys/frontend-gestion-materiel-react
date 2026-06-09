import { useQuery } from "@tanstack/react-query";
import { getUserLoans, checkActiveLoan } from "@/services/loan-service";
import type { UserLoansResponse, ActiveLoanResponse } from "@/services/loan-service";

export const useUserLoans = () => {
  return useQuery<UserLoansResponse, Error>({
    queryKey: ["user-loans"],
    queryFn: getUserLoans,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
    enabled: !!localStorage.getItem("token"),
  });
};

export const useActiveLoan = () => {
  return useQuery<ActiveLoanResponse, Error>({
    queryKey: ["active-loan"],
    queryFn: checkActiveLoan,
    staleTime: 30 * 1000, // 30 secondes
    retry: 1,
    enabled: !!localStorage.getItem("token"),
  });
};