import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/user-service";

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