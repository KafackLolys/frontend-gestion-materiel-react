import type { Loan } from "@/pages/loans/types/loan.types";
import { api } from "./api";

export interface UserLoansResponse {
  success: boolean;
  data: {
    active_loan: Loan | null;
    history: Loan[];
    history_meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
  message: string;
}

export interface ActiveLoanResponse {
  success: boolean;
  has_active_loan: boolean;
  active_loan: Loan | null;
}

export const getUserLoans = async (): Promise<UserLoansResponse> => {
  const { data } = await api.get("/loans/me");
  return data;
};

export const checkActiveLoan = async (): Promise<ActiveLoanResponse> => {
  const { data } = await api.get("loans/me/active");
  return data;
};

export interface LoansFilters {
  page?: number;
  per_page?: number;
  search?: string;
  status?: "pending" | "in_progress" | "completed";
  projector_id?: number;
  sort_by?: "loan_date" | "return_date" | "status" | "created_at";
  order?: "asc" | "desc";
}

export interface LoansResponse {
  data: Loan[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    search: string | null;
    status: string | null;
    projector_id: number | null;
    sort_by: string;
    order: string;
  };
  status: number;
  success: boolean;
}

export const getAllLoans = async (filters?: LoansFilters): Promise<LoansResponse> => {
  const { data } = await api.get("/loans", { params: filters });
  return data;
};