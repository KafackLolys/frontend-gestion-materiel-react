import { useState } from "react";
import { login, register, type RegisterPayload } from "../services/auth-service";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await login({ email, password });

      // Stocker le token
      localStorage.setItem("token", data.token);

      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur de connexion");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData: RegisterPayload) => {
    try {
      setLoading(true);
      setError(null);
      const data = await register(userData);
      localStorage.setItem("token", data.token);
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate("/dashboard"); // Redirection vers dashboard après inscription
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || "Erreur d'inscription";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    // Supprimer complètement le cache utilisateur
    queryClient.removeQueries({ queryKey: ["currentUser"] });
    // Optionnel : vider tout le cache
    // queryClient.clear();
    navigate("/login");
  };

  return { handleLogin, handleRegister, loading, error, logout };
};
