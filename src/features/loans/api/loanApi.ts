// features/loans/api/loanApi.ts
import { api } from "../../../services/api";
import type { Loan } from "../types/loan.types";

export const getLoans = async (): Promise<Loan[]> => {
  const { data } = await api.get("/loans");
  return data;
};