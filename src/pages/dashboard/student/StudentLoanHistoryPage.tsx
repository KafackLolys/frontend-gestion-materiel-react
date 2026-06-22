// src/pages/dashboard/student/StudentLoanHistoryPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  HiOutlineArrowLeft,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { LuProjector } from "react-icons/lu";
import { useUser } from "@/hooks/use-user";
import { HeaderDashboard } from "@/pages/components/HeaderDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";
import type { UserLoansResponse } from "@/services/loan-service";

const PAGE_SIZE = 10;

const StudentLoanHistoryPage = () => {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery<UserLoansResponse, Error>({
    queryKey: ["user-loans-history", page, search],
    queryFn: async () => {
      const { data } = await api.get("/loans/me", {
        params: {
          page,
          per_page: PAGE_SIZE,
          search: search || undefined,
        },
      });
      return data;
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
    enabled: !!localStorage.getItem("token"),
  });

  const history = data?.data?.history || [];
  const meta = data?.data?.history_meta;

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100">
      <HeaderDashboard
        icon={<HiOutlineCalendarDays className="w-8 h-8 text-indigo-600" />}
        title="Historique de mes emprunts"
        role={user?.role}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de navigation et recherche */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="rounded-full"
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">
              Historique complet
            </h1>
          </div>
          <div className="relative w-72">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher par projecteur..."
              className="pl-10"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-gray-500">Chargement de l'historique...</div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-20">
              <LuProjector className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                {search
                  ? "Aucun emprunt trouvé pour cette recherche"
                  : "Aucun historique d'emprunt"}
              </p>
              {!search && (
                <Button
                  onClick={() => navigate("/dashboard/student/loan")}
                  className="mt-4"
                >
                  Faire une demande d'emprunt
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Projecteur
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date d'emprunt
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date de retour
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition cursor-pointer"
                      onClick={() => navigate(`/dashboard/student/loan/${item.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-indigo-50">
                            <LuProjector className="w-5 h-5 text-indigo-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {item.projector?.marque || "Projecteur"}
                            </p>
                            {item.projector?.ref && (
                              <p className="text-xs text-gray-400">
                                Réf: {item.projector.ref}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <HiOutlineCalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-700">
                            {formatDate(item.loan_date)} à {formatTime(item.loan_date)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <HiOutlineClock className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="text-sm text-gray-700">
                            {item.return_date
                              ? `${formatDate(item.return_date)} à ${formatTime(item.return_date)}`
                              : "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                        >
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
              <p className="text-sm text-gray-500">
                Page {meta.current_page} sur {meta.last_page} ({meta.total}{" "}
                emprunts au total)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Précédent
                </Button>
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
            </div>
          )}
        </div>

        <footer className="mt-10 text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
          © 2025 Projector Hub – Historique des emprunts
        </footer>
      </main>
    </div>
  );
};

export default StudentLoanHistoryPage;