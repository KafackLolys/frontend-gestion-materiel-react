// src/services/user-service.ts
import { api } from "./api";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  image_profil: string
}

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