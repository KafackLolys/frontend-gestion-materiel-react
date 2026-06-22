// src\services\auth-service.ts
import { api } from "./api";

interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
}

export const login = async (data: LoginPayload) => {
  const response = await api.post("/login", data);
  return response.data;
};

export const register = async (data: RegisterPayload) => {
  const response = await api.post("/register", data);
  return response.data; // { user, token }
};

export const forgotPassword = async (email: string) => {
  const response = await api.post("/forgot-password", { email });
  return response.data;
};

export const verifyResetCode = async (email: string, code: string) => {
  const response = await api.post("/verify-reset-code", { email, code });
  return response.data;
};

export const resetPassword = async (email: string, code: string, password: string, password_confirmation: string) => {
  const response = await api.post("/reset-password", { email, code, password, password_confirmation });
  return response.data;
};
