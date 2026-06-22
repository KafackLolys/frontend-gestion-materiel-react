// src/pages/DashboardAdmin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineUsers,
  HiOutlineCpuChip,
  HiOutlineChartBar,
  HiOutlineExclamationTriangle,
  HiOutlineFlag,
} from "react-icons/hi2";
import { LuProjector } from "react-icons/lu";
import { useUser } from "../../hooks/use-user";
import { useStats } from "../../hooks/use-stats";
import { HeaderDashboard } from "../components/HeaderDashboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { data: statsData } = useStats();

  const [selectedStat, setSelectedStat] = useState<"projectors" | "loans" | null>(null);

  const stats = {
    totalUsers: statsData?.data.users.total || 0,
    totalProjecteurs: statsData?.data.projectors.total || 0,
    totalAccessoires: statsData?.data.accessories?.total || 0,
    empruntsActifs: (statsData?.data.loans.by_status.pending || 0) + (statsData?.data.loans.by_status.in_progress || 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-50 to-gray-200">
      <HeaderDashboard
        icon={<HiOutlineUsers className="w-8 h-8 text-purple-600" />}
        title="Administration IUC"
        role={user?.role}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cartes de stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatAdminCard
            title="Utilisateurs"
            value={stats.totalUsers}
            icon={<HiOutlineUsers className="w-6 h-6" />}
            color="purple"
          />
          <StatAdminCard
            title="Projecteurs"
            value={stats.totalProjecteurs}
            icon={<LuProjector className="w-6 h-6" />}
            color="blue"
            onClick={() => setSelectedStat("projectors")}
          />
          <StatAdminCard
            title="Accessoires"
            value={stats.totalAccessoires}
            icon={<HiOutlineCpuChip className="w-6 h-6" />}
            color="green"
          />
          <StatAdminCard
            title="Emprunts actifs"
            value={stats.empruntsActifs}
            icon={<HiOutlineChartBar className="w-6 h-6" />}
            color="orange"
            onClick={() => setSelectedStat("loans")}
          />
        </div>

        {/* Grille des actions d’administration */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminCard
            title="Gestion des utilisateurs"
            description="Ajouter, modifier, supprimer des comptes utilisateurs."
            buttonText="Gérer les utilisateurs"
            onClick={() => navigate("/dashboard/admin/users")}
            icon={<HiOutlineUsers className="w-8 h-8 text-purple-600" />}
          />
          <AdminCard
            title="Gestion des projecteurs"
            description="Ajouter, modifier, suivre l’état des projecteurs."
            buttonText="Gérer les projecteurs"
            onClick={() => navigate("/dashboard/admin/projectors")}
            icon={<LuProjector className="w-8 h-8 text-blue-600" />}
          />
          <AdminCard
            title="Gestion des accessoires"
            description="Gérer les catalogues d’accessoires (câbles, télécommandes...)."
            buttonText="Gérer les accessoires"
            onClick={() => navigate("/dashboard/admin/accessories")}
            icon={<HiOutlineCpuChip className="w-8 h-8 text-green-600" />}
          />
          <AdminCard
            title="Gestion des incidents"
            description="Signaler et suivre les incidents matériels."
            buttonText="Gérer les incidents"
            onClick={() => navigate("/dashboard/admin/incidents")}
            icon={<HiOutlineFlag className="w-8 h-8 text-orange-600" />}
          />
          <AdminCard
            title="Journal d'activité"
            description="Consulter l’historique et les statistiques d’emprunt."
            buttonText="Voir le journal d'activité"
            onClick={() => navigate("/dashboard/admin/logs")}
            icon={<HiOutlineExclamationTriangle className="w-8 h-8 text-red-600" />}
          />
        </div>

        <footer className="mt-12 text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
          © 2025 Projector Hub – Administration
        </footer>
      </main>

      {/* Modal pour les sous-statistiques */}
      <Dialog open={selectedStat !== null} onOpenChange={(open) => !open && setSelectedStat(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Détails des {selectedStat === "projectors" ? "projecteurs" : "emprunts"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedStat === "projectors" && statsData?.data.projectors.by_status && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100">
                  <p className="text-sm font-medium">Disponibles</p>
                  <p className="text-2xl font-bold">{statsData.data.projectors.by_status.disponible}</p>
                </div>
                <div className="p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                  <p className="text-sm font-medium">Empruntés</p>
                  <p className="text-2xl font-bold">{statsData.data.projectors.by_status.emprunte}</p>
                </div>
                <div className="p-4 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-100">
                  <p className="text-sm font-medium">En maintenance</p>
                  <p className="text-2xl font-bold">{statsData.data.projectors.by_status.en_maintenance}</p>
                </div>
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
                  <p className="text-sm font-medium">Hors service</p>
                  <p className="text-2xl font-bold">{statsData.data.projectors.by_status.hors_service}</p>
                </div>
              </div>
            )}
            {selectedStat === "loans" && statsData?.data.loans.by_status && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-100">
                  <p className="text-sm font-medium">En attente</p>
                  <p className="text-2xl font-bold">{statsData.data.loans.by_status.pending}</p>
                </div>
                <div className="p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                  <p className="text-sm font-medium">En cours</p>
                  <p className="text-2xl font-bold">{statsData.data.loans.by_status.in_progress}</p>
                </div>
                <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100">
                  <p className="text-sm font-medium">Terminés</p>
                  <p className="text-2xl font-bold">{statsData.data.loans.by_status.completed}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Sous-composants
const StatAdminCard = ({ title, value, icon, color, onClick }: any) => {
  const colorMap: Record<string, string> = {
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-green-50 text-green-700 border-green-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
  };
  return (
    <div 
      className={`rounded-2xl border p-5 shadow-sm transition-all ${colorMap[color]} ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-xl bg-white/50">{icon}</div>
      </div>
    </div>
  );
};

const AdminCard = ({ title, description, buttonText, onClick, icon }: any) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
    <div className="flex items-center gap-3 mb-3">
      {icon}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-sm text-gray-500 flex-1 mb-4">{description}</p>
    <button
      onClick={onClick}
      className="py-2 px-4 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm font-medium"
    >
      {buttonText}
    </button>
  </div>
);

export default DashboardAdmin;
