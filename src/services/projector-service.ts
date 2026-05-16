// src/services/user-service.ts
import type { ProjectorsApiResponse } from "@/types/projector";
import { api } from "./api";

export const createProjector = async (formData: FormData) => {
  const response = await api.post("/projectors", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateProjector = async (id: number, formData: FormData) => {
  const response = await api.post(`/projectors/${id}?_method=PUT`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteProjector = async (id: number) => {
  const response = await api.delete(`/projectors/${id}`);
  return response.data;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await api.post("/projector/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getProjectors = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  order?: "asc" | "desc";
}): Promise<ProjectorsApiResponse> => {
  const response = await api.get("/projectors", { params });
  return response.data;
};

export const uploadProjectorImage = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await api.post(`/projectors/${id}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
