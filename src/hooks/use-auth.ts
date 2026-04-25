import { useState } from "react";
import { login } from "../services/auth-service";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return { handleLogin, loading, error };
};