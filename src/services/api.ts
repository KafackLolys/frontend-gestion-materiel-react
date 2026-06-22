// src/services/api.ts
import axios from "axios";

export const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL;

export const API_URL =
    import.meta.env.VITE_API_URL;



export const api = axios.create({
  baseURL: API_URL,
});

// Intercepteur pour token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});