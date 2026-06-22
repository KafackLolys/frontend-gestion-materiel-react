// src/services/incident-service.ts
import type { IncidentsApiResponse, Incident } from "@/types/incident";
import { api } from "./api";

export const getIncidents = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  order?: "asc" | "desc";
}): Promise<IncidentsApiResponse> => {
  const response = await api.get("/incidents", { params });
  return response.data;
};

export const getIncident = async (id: number): Promise<Incident> => {
  const response = await api.get(`/incidents/${id}`);
  return response.data;
};

export const createIncident = async (data: { title: string; description?: string }) => {
  const response = await api.post("/incidents", data);
  return response.data;
};

export const updateIncident = async (id: number, data: { title?: string; description?: string }) => {
  const response = await api.put(`/incidents/${id}`, data);
  return response.data;
};

export const deleteIncident = async (id: number) => {
  const response = await api.delete(`/incidents/${id}`);
  return response.data;
};