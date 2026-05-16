import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/LoginPage";
import HomePage from "../pages/home/HomePage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ProfilePage from "../pages/profile/ProfilePage";
import SettingsPage from "../pages/setting/SettingsPage";
import UsersPage from "@/pages/dashboard/user/UsersPage";
import ProjectorsPage from "@/pages/dashboard/projector/ProjectorsPage";
import AccessoriesPage from "@/pages/dashboard/accessory/AccessoriesPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<HomePage />} />
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Dashboard */}
      <Route path="/dashboard" element={<DashboardPage />} />
      {/* Dashboard Admin */}
      <Route path="/dashboard/admin/users" element={<UsersPage />} />
      <Route path="/dashboard/admin/projectors" element={<ProjectorsPage />} />
      <Route path="/dashboard/admin/accessories" element={<AccessoriesPage />} />
      {/* Dashboard Manager */}
      <Route path="/dashboard/manager/users" element={<UsersPage />} />
      <Route path="/dashboard/manager/projectors" element={<ProjectorsPage />} />
      <Route path="/dashboard/manager/accessories" element={<AccessoriesPage />} />
      {/* Profile */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
};

export default AppRoutes;
