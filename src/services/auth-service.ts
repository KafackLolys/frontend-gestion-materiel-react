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