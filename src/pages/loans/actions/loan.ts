import { api } from "../../../services/api";
import type { Loan } from "../types/loan.types";

export const getLoans = async (): Promise<Loan[]> => {
  const { data } = await api.get("/loans");
  return data;
};

export const createLoan = async (payload: any) => {
  const { data } = await api.post("/loans", payload);
  return data;
};

export const cancelLoan = async (id: number): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete(`/loans/${id}`);
  return data;
};

export const rejectLoan = async (id: number): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete(`/loans/${id}/reject`);
  return data;
};

export const updateLoan = async (id: number, data: any) => {
  const response = await api.put(`/loans/${id}`, data);
  return response.data;
};