import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/LoginPage";
import HomePage from "../pages/home/HomePage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ProfilePage from "../pages/profile/ProfilePage";
import SettingsPage from "../pages/setting/SettingsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
};

export default AppRoutes;
