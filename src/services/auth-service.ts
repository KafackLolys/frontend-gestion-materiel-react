// src\services\auth-service.ts
import { api } from "./api";

interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (data: LoginPayload) => {
  const response = await api.post("/login", data);
  return response.data;
};