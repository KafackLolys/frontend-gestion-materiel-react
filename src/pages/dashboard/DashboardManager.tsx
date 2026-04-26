// src/pages/DashboardPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineComputerDesktop,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineExclamationTriangle,
  HiOutlineArrowPath,
  HiOutlineChartBar,
  HiOutlineCpuChip,
} from "react-icons/hi2";
import { LuProjector } from "react-icons/lu";
import { UserAvatar } from "../home/components/UserAvatar";
import { GiExplosiveMaterials } from "react-icons/gi";
import { useUser } from "../../hooks/useUser";

// Types simplifiés
interface EmpruntRecent {
  id: number;
  projecteur: string;
  emprunteur: string;
  dateRetourPrevue: string;
  statut: "en_cours" | "en_retard" | "a_venir";
}
type ColorKey = "green" | "blue" | "red" | "purple";

const DashboardManager = () => {
    const { data: user } = useUser();
  const navigate = useNavigate();
  const [stats] = useState({
    totalProjecteurs: 24,
    disponibles: 12,
    empruntsEnCours: 8,
    retards: 2,
  });

  const [empruntsRecents] = useState<EmpruntRecent[]>([
    {
      id: 1,
      projecteur: "Epson EB‑695Wi",
      emprunteur: "Jean Dupont",
      dateRetourPrevue: "2025-04-27",
      statut: "en_cours",
    },
    {
      id: 2,
      projecteur: "BenQ TH671ST",
      emprunteur: "Marie Curie",
      dateRetourPrevue: "2025-04-25",
      statut: "en_retard",
    },
    {
      id: 3,
      projecteur: "Optoma GT1080HDR",
      emprunteur: "Pierre Martin",
      dateRetourPrevue: "2025-04-28",
      statut: "a_venir",
    },
    {
      id: 4,
      projecteur: "ViewSonic PX701HD",
      emprunteur: "Sophie Dubois",
      dateRetourPrevue: "2025-04-26",
      statut: "en_cours",
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header avec navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <HiOutlineComputerDesktop className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard IUC Projecteur
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline capitalize">
              {user?.role === "admin" && "Administrateur"}
              {user?.role === "manager" && "Gérant"}
              {user?.role === "teacher" && "Enseignant"}
              {user?.role === "student_delegate" && "élève"}
            </span>
            <UserAvatar />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Projecteurs disponibles"
            value={stats.disponibles}
            total={stats.totalProjecteurs}
            icon={<LuProjector className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Emprunts en cours"
            value={stats.empruntsEnCours}
            icon={<HiOutlineCalendar className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Retards"
            value={stats.retards}
            icon={<HiOutlineExclamationTriangle className="w-6 h-6" />}
            color="red"
          />
          <StatCard
            title="Taux d'occupation"
            value={`${Math.round(((stats.totalProjecteurs - stats.disponibles) / stats.totalProjecteurs) * 100)}%`}
            icon={<HiOutlineChartBar className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Deux colonnes : liste des emprunts récents + actions rapides */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tableau des emprunts récents */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <HiOutlineClock className="w-5 h-5 text-blue-500" />
              Emprunts récents
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="pb-3">Projecteur</th>
                    <th className="pb-3">Emprunteur</th>
                    <th className="pb-3">Retour prévu</th>
                    <th className="pb-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {empruntsRecents.map((emprunt) => (
                    <tr
                      key={emprunt.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="py-3 text-sm font-medium text-gray-900">
                        {emprunt.projecteur}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {emprunt.emprunteur}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {emprunt.dateRetourPrevue}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            emprunt.statut === "en_retard"
                              ? "bg-red-100 text-red-800"
                              : emprunt.statut === "en_cours"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {emprunt.statut === "en_retard"
                            ? "En retard"
                            : emprunt.statut === "en_cours"
                              ? "En cours"
                              : "À venir"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => navigate("/emprunts")}
              className="mt-4 text-sm text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Voir tous les emprunts
              <HiOutlineArrowPath className="w-3 h-3" />
            </button>
          </div>

          {/* Panneau d'actions et info */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <GiExplosiveMaterials className="w-5 h-5 text-blue-500" />
                Matériels disponibles
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/projector")}
                  className="flex items-center gap-3 w-full cursor-pointer py-2.5 px-4 rounded-xl bg-blue-50 text-black hover:bg-blue-100 transition text-sm font-medium"
                >
                  <LuProjector className="w-5 h-5" />
                  Projecteurs
                </button>
                <button
                  onClick={() => navigate("/accessory")}
                  className="flex items-center gap-3 w-full cursor-pointer py-2.5 px-4 rounded-xl bg-blue-50 text-black hover:bg-blue-100 transition text-sm font-medium"
                >
                  <HiOutlineCpuChip className="w-5 h-5" />
                  Accessoires
                </button>
              </div>
            </div>

            {/* Info règle emprunt */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
              <h3 className="font-semibold text-amber-800 flex items-center gap-2 mb-2">
                <HiOutlineExclamationTriangle className="w-5 h-5" />
                Rappel
              </h3>
              <p className="text-sm text-amber-700">
                Durée max d'emprunt : <strong>48h</strong>. Tout retard entraîne
                une pénalité de ______________. Pensez à restituer le matériel
                au service technique.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
          © 2025 IUC Projecteur – Gestion d'emprunt de projecteurs
        </footer>
      </main>
    </div>
  );
};

// Composant pour une carte statistique
const StatCard = ({
  title,
  value,
  total,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  total?: number;
  icon: React.ReactNode;
  color: ColorKey;
}) => {
  const colorClasses: Record<ColorKey, string> = {
    green: "bg-green-50 text-green-700 border-green-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    red: "bg-red-50 text-red-700 border-red-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
  };
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${colorClasses[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {total && (
            <p className="text-xs opacity-70 mt-1">sur {total} projecteurs</p>
          )}
        </div>
        <div className={`p-2 rounded-xl bg-white/50`}>{icon}</div>
      </div>
    </div>
  );
};

export default DashboardManager;
