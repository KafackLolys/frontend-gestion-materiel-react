// src/pages/dashboard/DashboardManager.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineComputerDesktop,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineExclamationTriangle,
  HiOutlineChartBar,
  HiOutlineCpuChip,
  HiOutlineMagnifyingGlass,
  HiOutlineFlag,
} from "react-icons/hi2";
import { LuProjector } from "react-icons/lu";
import { GiExplosiveMaterials } from "react-icons/gi";
import { useUser } from "../../hooks/use-user";
import { useStats } from "../../hooks/use-stats";
import { useAllLoans } from "../loans/hooks/useLoans";
import { HeaderDashboard } from "../components/HeaderDashboard";
import { MdGroupAdd } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { HiOutlineAdjustments } from "react-icons/hi";

type ColorKey = "green" | "blue" | "red" | "purple";
type LoanStatus = "pending" | "in_progress" | "completed";

const DashboardManager = () => {
  const { data: user } = useUser();
  const { data: statsData } = useStats();
  console.log("statsData :", statsData);
  const navigate = useNavigate();

  // États pour le modal
  const [selectedStat, setSelectedStat] = useState<
    "projectors" | "loans" | null
  >(null);

  // États pour les filtres
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LoanStatus | "all">("all");
  const [page, setPage] = useState(1);

  // Debounce pour la recherche
  const debouncedSetSearch = useCallback(
    debounce((value: string) => setSearch(value), 500),
    [],
  );

  // Récupération des emprunts
  const { loans, isLoading, meta, refetch } = useAllLoans({
    page,
    per_page: 10,
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    sort_by: "loan_date",
    order: "desc",
  });

  // Statistiques réelles issues de l'API
  const totalProjecteurs = statsData?.data.projectors.total || 0;
  const disponibles = statsData?.data.projectors.by_status.disponible || 0;
  const empruntes = statsData?.data.projectors.by_status.emprunte || 0;
  const enMaintenance =
    statsData?.data.projectors.by_status.en_maintenance || 0;
  const horsService = statsData?.data.projectors.by_status.hors_service || 0;

  const empruntsEnCours = statsData?.data.loans.by_status.in_progress || 0;
  const empruntsEnAttente = statsData?.data.loans.by_status.pending || 0;
  const empruntsTermines = statsData?.data.loans.by_status.completed || 0;

  const totalUsers = statsData?.data?.users?.total || 0;

  // Retards : emprunt en cours non retourné dans le délai
  // - date d'emprunt antérieure à aujourd'hui (dépassé), ou
  // - emprunté aujourd'hui mais après 22h (retour non effectué le jour même avant l'heure limite)
  const isEnRetard = (loan: { status: string; loan_date: string }) => {
    if (loan.status !== "in_progress") return false;
    const loanDate = new Date(loan.loan_date);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isBeforeToday = loanDate < todayStart;
    const isSameDay = loanDate.toDateString() === now.toDateString();
    const isPast22h = now.getHours() >= 22;
    return isBeforeToday || (isSameDay && isPast22h);
  };

  const retards = loans.filter(isEnRetard).length;

  // Formater la date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  // Obtenir le statut en français
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "in_progress":
        return "En cours";
      case "completed":
        return "Terminé";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-50 to-gray-200">
      <HeaderDashboard
        icon={<HiOutlineComputerDesktop className="w-8 h-8 text-blue-600" />}
        title="Dashboard Projector Hub"
        role={user?.role}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Projecteurs disponibles"
            value={disponibles}
            total={totalProjecteurs}
            icon={<LuProjector className="w-6 h-6" />}
            color="green"
            onClick={() => setSelectedStat("projectors")}
          />
          <StatCard
            title="Emprunts en cours"
            value={empruntsEnCours}
            icon={<HiOutlineCalendar className="w-6 h-6" />}
            color="blue"
            onClick={() => setSelectedStat("loans")}
          />
          <StatCard
            title="Retards (non retourné à l'heure)"
            value={retards}
            icon={<HiOutlineExclamationTriangle className="w-6 h-6" />}
            color="red"
          />
          <StatCard
            title="Nombre total d'utilisateurs"
            value={totalUsers}
            icon={<FaUserCog className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative w-64">
                <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher par classe, N° CNI, Salle..."
                  className="pl-10"
                  onChange={(e) => debouncedSetSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineAdjustments className="text-gray-400" />
                <Select
                  value={statusFilter}
                  onValueChange={(value: LoanStatus | "all") =>
                    setStatusFilter(value)
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des emprunts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des emprunts */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <HiOutlineClock className="w-5 h-5 text-blue-500" />
              Emprunts récents
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="pb-3">Emprunteur</th>
                    <th className="pb-3">Projecteur</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-gray-500"
                      >
                        Chargement ...
                      </td>
                    </tr>
                  )}
                  {loans.map((loan) => (
                    <tr
                      key={loan.id}
                      className={`transition cursor-pointer ${isEnRetard(loan) ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}
                      onClick={() =>
                        navigate(`/dashboard/manager/loans/${loan.id}`)
                      }
                    >
                      <td className="py-3 text-sm font-medium text-gray-900">
                        {loan.user?.first_name} {loan.user?.last_name}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {loan.projector?.marque || "-"}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {formatDate(loan.loan_date)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}
                        >
                          {getStatusLabel(loan.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!isLoading && loans.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-gray-500"
                      >
                        Aucun emprunt trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Précédent
                </Button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {page} sur {meta.last_page}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((p) => Math.min(meta.last_page, p + 1))
                  }
                  disabled={page === meta.last_page}
                >
                  Suivant
                </Button>
              </div>
            )}
          </div>

          {/* Panneau d'actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <GiExplosiveMaterials className="w-5 h-5 text-blue-500" />
                Gestion du matériel
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/dashboard/manager/projectors")}
                  className="flex items-center gap-3 w-full py-2.5 px-4 rounded-xl bg-blue-50 text-black hover:bg-blue-100 transition text-sm font-medium"
                >
                  <LuProjector className="w-5 h-5" />
                  Projecteurs
                </button>
                <button
                  onClick={() => navigate("/dashboard/manager/accessories")}
                  className="flex items-center gap-3 w-full py-2.5 px-4 rounded-xl bg-blue-50 text-black hover:bg-blue-100 transition text-sm font-medium"
                >
                  <HiOutlineCpuChip className="w-5 h-5" />
                  Accessoires
                </button>
                <button
                  onClick={() => navigate("/dashboard/manager/incidents")}
                  className="flex items-center gap-3 w-full py-2.5 px-4 rounded-xl bg-orange-50 text-black hover:bg-orange-100 transition text-sm font-medium"
                >
                  <HiOutlineFlag className="w-5 h-5" />
                  Incidents
                </button>
              </div>

              <div className="w-full h-px bg-gray-200 my-5" />

              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MdGroupAdd className="w-5 h-5 text-blue-500" />
                Gérer les utilisateurs
              </h2>
              <button
                onClick={() => navigate("/dashboard/manager/users")}
                className="flex items-center gap-3 w-full py-2.5 px-4 rounded-xl bg-blue-50 text-black hover:bg-blue-100 transition text-sm font-medium"
              >
                <FaUserCog className="w-5 h-5" />
                Liste des utilisateurs
              </button>
            </div>
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
          © 2025 Projector Hub – Gestion d'emprunt de projecteurs
        </footer>
      </main>

      {/* Modal pour les sous-statistiques */}
      <Dialog
        open={selectedStat !== null}
        onOpenChange={(open) => !open && setSelectedStat(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Détails des{" "}
              {selectedStat === "projectors" ? "projecteurs" : "emprunts"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedStat === "projectors" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100">
                  <p className="text-sm font-medium">Disponibles</p>
                  <p className="text-2xl font-bold">{disponibles}</p>
                </div>
                <div className="p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                  <p className="text-sm font-medium">Empruntés</p>
                  <p className="text-2xl font-bold">{empruntes}</p>
                </div>
                <div className="p-4 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-100">
                  <p className="text-sm font-medium">En maintenance</p>
                  <p className="text-2xl font-bold">{enMaintenance}</p>
                </div>
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
                  <p className="text-sm font-medium">Hors service</p>
                  <p className="text-2xl font-bold">{horsService}</p>
                </div>
              </div>
            )}
            {selectedStat === "loans" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-100">
                  <p className="text-sm font-medium">En attente</p>
                  <p className="text-2xl font-bold">{empruntsEnAttente}</p>
                </div>
                <div className="p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                  <p className="text-sm font-medium">En cours</p>
                  <p className="text-2xl font-bold">{empruntsEnCours}</p>
                </div>
                <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100">
                  <p className="text-sm font-medium">Terminés</p>
                  <p className="text-2xl font-bold">{empruntsTermines}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Composant StatCard (avec onClick optionnel)
const StatCard = ({
  title,
  value,
  total,
  icon,
  color,
  onClick,
}: {
  title: string;
  value: string | number;
  total?: number;
  icon: React.ReactNode;
  color: ColorKey;
  onClick?: () => void;
}) => {
  const colorClasses: Record<ColorKey, string> = {
    green: "bg-green-50 text-green-700 border-green-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    red: "bg-red-50 text-red-700 border-red-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
  };
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition-all ${colorClasses[color]} ${onClick ? "cursor-pointer hover:shadow-md hover:scale-[1.02]" : ""}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {total && (
            <p className="text-xs opacity-70 mt-1">sur {total} projecteurs</p>
          )}
        </div>
        <div className="p-2 rounded-xl bg-white/50">{icon}</div>
      </div>
    </div>
  );
};

export default DashboardManager;
