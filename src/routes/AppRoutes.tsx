import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/LoginPage";
import HomePage from "../pages/home/HomePage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import NotFoundPage from "../pages/NotFoundPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ProfilePage from "../pages/profile/ProfilePage";
import SettingsPage from "../pages/setting/SettingsPage";
import UsersPage from "@/pages/dashboard/user/UsersPage";
import ProjectorsPage from "@/pages/dashboard/projector/ProjectorsPage";
import AccessoriesPage from "@/pages/dashboard/accessory/AccessoriesPage";
import LoanRequestPage from "@/pages/loans/LoanRequestPage";
import LoanDetailPage from "@/pages/dashboard/loan/LoanDetailPage";
import ActivityLogsPage from "@/pages/dashboard/logs/ActivityLogsPage";
import IncidentsPage from "@/pages/dashboard/incident/IncidentsPage";
import StudentLoanHistoryPage from "@/pages/dashboard/student/StudentLoanHistoryPage";
import { DashboardLayout } from "@/components/DashboardLayout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<HomePage />} />
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      {/* Dashboard with sidebar layout */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        {/* Dashboard Admin */}
        <Route path="admin/users" element={<UsersPage />} />
        <Route path="admin/projectors" element={<ProjectorsPage />} />
        <Route path="admin/accessories" element={<AccessoriesPage />} />
        <Route path="admin/logs" element={<ActivityLogsPage />} />
        <Route path="admin/incidents" element={<IncidentsPage />} />
        {/* Dashboard Manager */}
        <Route path="manager/users" element={<UsersPage />} />
        <Route path="manager/projectors" element={<ProjectorsPage />} />
        <Route path="manager/accessories" element={<AccessoriesPage />} />
        <Route path="manager/incidents" element={<IncidentsPage />} />
        <Route path="manager/loans/:id" element={<LoanDetailPage />} />
        {/* Dashbord Student */}
        <Route path="student/loan" element={<LoanRequestPage />} />
        
      </Route>
      {/* Student routes */}
      <Route path="/student/historique-emprunts" element={<StudentLoanHistoryPage />} />
      {/* Profile */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;