import type { AccessoriesApiResponse } from "@/types/accessory";
import { api } from "./api";

export const createAccessory = async (formData: FormData) => {
  const response = await api.post("/accessories", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateAccessory = async (id: number, formData: FormData) => {
  const response = await api.post(`/accessories/${id}?_method=PUT`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteAccessory = async (id: number) => {
  const response = await api.delete(`/accessories/${id}`);
  return response.data;
};

export const getAccessories = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  order?: "asc" | "desc";
}): Promise<AccessoriesApiResponse> => {
  const response = await api.get("/accessories", { params });
  return response.data;
};
