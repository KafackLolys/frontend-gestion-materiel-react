// src/services/user-service.ts
import type { User, UsersApiResponse } from "@/types/user";
import { api } from "./api";

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get("/me");
  return response.data;
};

export const updateProfile = async (data: { first_name: string; last_name: string; email: string }) => {
  const response = await api.put("/user/profile", data);
  return response.data;
};

export const updatePassword = async (data: { current_password: string; new_password: string; new_password_confirmation: string }) => {
  const response = await api.put("/user/password", data);
  return response.data;
};

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('image_profil', file);
  const response = await api.post('/user/image_profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getUsers = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  order?: 'asc' | 'desc';
}): Promise<UsersApiResponse> => {
  const response = await api.get('/users', { params });
  return response.data;
};

export const createAdmin = async (data: Partial<User> & { password?: string }) => {
  const response = await api.post('/users', data);
  return response.data;
};

export const createUser = async (data: Partial<User> & { password?: string }) => {
  const response = await api.post('/users', data);
  return response.data;
};

export const updateUser = async (id: number, data: Partial<User>) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};