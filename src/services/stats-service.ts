import type { StatsApiResponse } from "@/types/stats";
import { api } from "./api";

export const getStats = async (): Promise<StatsApiResponse> => {
  const response = await api.get("/stats");
  return response.data;
};
