// src/pages/DashboardAdmin.tsx
import { useNavigate } from "react-router-dom";
import {
  HiOutlineUsers,
  HiOutlineCpuChip,
  HiOutlineChartBar,
  HiOutlinePlusCircle,
} from "react-icons/hi2";
import { LuProjector } from "react-icons/lu";
import { UserAvatar } from "../home/components/UserAvatar";
import { useUser } from "../../hooks/useUser";


const DashboardAdmin = () => {
  const navigate = useNavigate();
  useUser();

  // Stats simulées
  const stats = {
    totalUsers: 48,
    totalProjecteurs: 24,
    totalAccessoires: 37,
    empruntsActifs: 12,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <HiOutlineUsers className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Administration IUC
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline capitalize">
              Administrateur
            </span>
            <UserAvatar />
          </div>
        </div>
      </header>

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
          />
        </div>

        {/* Grille des actions d’administration */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminCard
            title="Gestion des utilisateurs"
            description="Ajouter, modifier, supprimer des comptes utilisateurs."
            buttonText="Gérer les utilisateurs"
            onClick={() => navigate("/admin/users")}
            icon={<HiOutlineUsers className="w-8 h-8 text-purple-600" />}
          />
          <AdminCard
            title="Gestion des projecteurs"
            description="Ajouter, modifier, suivre l’état des projecteurs."
            buttonText="Gérer les projecteurs"
            onClick={() => navigate("/admin/projectors")}
            icon={<LuProjector className="w-8 h-8 text-blue-600" />}
          />
          <AdminCard
            title="Gestion des accessoires"
            description="Gérer les catalogues d’accessoires (câbles, télécommandes...)."
            buttonText="Gérer les accessoires"
            onClick={() => navigate("/admin/accessories")}
            icon={<HiOutlineCpuChip className="w-8 h-8 text-green-600" />}
          />
          <AdminCard
            title="Rapports d’emprunts"
            descriptio="Consulter l’historique et les statistiques d’emprunt."
            buttonText="Voir les rapports"
            onClick={() => navigate("/admin/reports")}
            icon={<HiOutlineChartBar className="w-8 h-8 text-orange-600" />}
          />
          <AdminCard
            title="Ajout rapide"
            description=    "Ajouter un projecteur ou un accessoire en une étape."
            buttonText="Ajouter"
            onClick={() => navigate("/admin/quick-add")}
            icon={<HiOutlinePlusCircle className="w-8 h-8 text-emerald-600" />}
          />
        </div>

        <footer className="mt-12 text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
          © 2025 IUC Projecteur – Administration
        </footer>
      </main>
    </div>
  );
};

// Sous-composants
const StatAdminCard = ({ title, value, icon, color }: any) => {
  const colorMap: Record<string, string> = {
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-green-50 text-green-700 border-green-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
  };
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${colorMap[color]}`}>
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