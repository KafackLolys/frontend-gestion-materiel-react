// src/components/AppSidebar.tsx
import { useLocation, useNavigate } from "react-router-dom";
import {
  HiOutlineUsers,
  HiOutlineCpuChip,
  HiOutlineExclamationTriangle,
  HiOutlineFlag,
  HiOutlineHome,
} from "react-icons/hi2";
import { LuProjector } from "react-icons/lu";
import { FaUserGraduate } from "react-icons/fa";
import { useUser } from "@/hooks/use-user";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const adminMenu: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <HiOutlineHome className="w-5 h-5" /> },
  { label: "Utilisateurs", path: "/dashboard/admin/users", icon: <HiOutlineUsers className="w-5 h-5" /> },
  { label: "Projecteurs", path: "/dashboard/admin/projectors", icon: <LuProjector className="w-5 h-5" /> },
  { label: "Accessoires", path: "/dashboard/admin/accessories", icon: <HiOutlineCpuChip className="w-5 h-5" /> },
  { label: "Incidents", path: "/dashboard/admin/incidents", icon: <HiOutlineFlag className="w-5 h-5" /> },
  { label: "Journal d'activité", path: "/dashboard/admin/logs", icon: <HiOutlineExclamationTriangle className="w-5 h-5" /> },
];

const managerMenu: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <HiOutlineHome className="w-5 h-5" /> },
  { label: "Utilisateurs", path: "/dashboard/manager/users", icon: <HiOutlineUsers className="w-5 h-5" /> },
  { label: "Projecteurs", path: "/dashboard/manager/projectors", icon: <LuProjector className="w-5 h-5" /> },
  { label: "Accessoires", path: "/dashboard/manager/accessories", icon: <HiOutlineCpuChip className="w-5 h-5" /> },
  { label: "Incidents", path: "/dashboard/manager/incidents", icon: <HiOutlineFlag className="w-5 h-5" /> },
];

const studentMenu: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <HiOutlineHome className="w-5 h-5" /> },
  { label: "Nouvel emprunt", path: "/dashboard/student/loan", icon: <LuProjector className="w-5 h-5" /> },
  { label: "Mes emprunts", path: "/dashboard", icon: <FaUserGraduate className="w-5 h-5" /> },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: user } = useUser();

  const getMenuItems = (): NavItem[] => {
    if (!user) return [];
    switch (user.role) {
      case "admin":
        return adminMenu;
      case "manager":
        return managerMenu;
      case "student_delegate":
        return studentMenu;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();
  const projetName = import.meta.env.VITE_PROJET_NAME;

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="p-4 text-2xl font-bold text-center text-green-700">
        {projetName}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={`${item.label}-${item.path}`}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => navigate(item.path)}
                      tooltip={item.label}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground text-center group-data-[collapsible=icon]:hidden">
          © 2025 Projector Hub
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}