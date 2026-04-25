import { Routes, Route } from "react-router-dom";
import Login from "../features/auth/LoginPage";
import HomePage from "../features/home/HomePage";
import RegisterPage from "../features/auth/RegisterPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};

export default AppRoutes;