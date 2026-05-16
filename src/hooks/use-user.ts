import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, getUsers } from "../services/user-service";
import type { UsersApiResponse } from "@/types/user";

export const useUser = () => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["currentUser", token], // la clé inclut le token
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    enabled: !!token, // ne lance la requête que si token existe
    retry: false,
  });
};

export type SortColumn = "last_name" | "first_name" | "email" | "role";

export const useUsers = (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: SortColumn;
  order?: "asc" | "desc";
}) => {
  const query = useQuery<UsersApiResponse, Error>({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  return {
    ...query,
    users: query.data?.data ?? [],
    meta: query.data?.meta,
    filters: query.data?.filters,
  };
};