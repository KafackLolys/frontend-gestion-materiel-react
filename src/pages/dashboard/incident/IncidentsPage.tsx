// src/pages/dashboard/incident/IncidentsPage.tsx
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
  HiSortAscending,
  HiSortDescending,
} from "react-icons/hi";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineMagnifyingGlass,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import { toast } from "react-hot-toast";
import debounce from "lodash.debounce";

import { HeaderDashboard } from "../../components/HeaderDashboard";
import { useIncidents, type IncidentSortColumn } from "@/hooks/use-incident";
import type { Incident } from "@/types/incident";
import {
  createIncident,
  updateIncident,
  deleteIncident,
} from "@/services/incident-service";

// Shadcn/ui components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/use-user";
import { IncidentFormModal } from "./IncidentFormModal";

type SortOrder = "asc" | "desc" | null;

const IncidentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [incidentToDelete, setIncidentToDelete] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<IncidentSortColumn | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [page, setPage] = useState(1);

  const { data: currentUser } = useUser();

  const queryParams = {
    page,
    per_page: 10,
    search: search || undefined,
    sort_by: sortColumn || undefined,
    ...(sortOrder !== null && { order: sortOrder }),
  };

  const { incidents, isLoading, error, meta } = useIncidents(queryParams);

  const debouncedSetSearch = useCallback(
    debounce((value: string) => setSearch(value), 500),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  const handleSort = (column: IncidentSortColumn) => {
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortOrder("asc");
    } else {
      if (sortOrder === "asc") setSortOrder("desc");
      else if (sortOrder === "desc") {
        setSortColumn(null);
        setSortOrder(null);
      }
    }
  };

  const getSortIcon = (column: IncidentSortColumn) => {
    if (sortColumn !== column) return <HiSortAscending className="w-4 h-4" />;
    if (sortOrder === "asc") return <HiSortAscending className="w-4 h-4" />;
    if (sortOrder === "desc") return <HiSortDescending className="w-4 h-4" />;
    return <HiSortAscending className="w-4 h-4" />;
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= (meta?.last_page ?? 1)) {
      setPage(newPage);
    }
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: createIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      toast.success("Incident créé avec succès");
      handleCloseModal();
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erreur lors de la création";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { title?: string; description?: string } }) =>
      updateIncident(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      toast.success("Incident modifié avec succès");
      handleCloseModal();
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erreur lors de la modification";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      toast.success("Incident supprimé");
      setIsDeleteDialogOpen(false);
      setIncidentToDelete(null);
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erreur lors de la suppression";
      toast.error(message);
    },
  });

  const handleOpenModal = (incident?: Incident) => {
    setEditingIncident(incident || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingIncident(null);
    setIsModalOpen(false);
  };

  const confirmDelete = (id: number, title: string) => {
    setIncidentToDelete({ id, title });
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (incidentToDelete) deleteMutation.mutate(incidentToDelete.id);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <HeaderDashboard
        icon={<HiOutlineExclamationTriangle className="w-8 h-8 text-orange-600" />}
        title="Gestion des incidents"
        role={currentUser?.role}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800">
            Incidents
          </h1>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative w-full sm:w-64">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher par titre..."
                className="pl-10"
                onChange={(e) => debouncedSetSearch(e.target.value)}
              />
            </div>
            <Button
              onClick={() => handleOpenModal()}
              className="bg-orange-600 h-10 px-5"
            >
              <HiOutlinePlus className="w-5 h-5 mr-2" />
              Signaler
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            Chargement...
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center text-red-500">
            Erreur: {(error as Error).message}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {incidents.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Aucun incident
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort("title")}
                      >
                        <div className="flex items-center gap-2">
                          Titre {getSortIcon("title")}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Signalé par
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort("created_at")}
                      >
                        <div className="flex items-center gap-2">
                          Date {getSortIcon("created_at")}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidents.map((incident) => (
                      <tr
                        key={incident.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {incident.title}
                        </td>
                        <td className="px-6 py-4 text-sm max-w-xs truncate">
                          {incident.description || (
                            <span className="text-gray-400 italic">
                              Aucune description
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {incident.user?.name || "Inconnu"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(incident.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenModal(incident)}
                            className="text-blue-600"
                          >
                            <HiOutlinePencil className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              confirmDelete(incident.id, incident.title)
                            }
                            className="text-red-600"
                          >
                            <HiOutlineTrash className="w-5 h-5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {meta && meta.last_page > 1 && (
                  <div className="flex justify-center items-center gap-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1}
                    >
                      <HiOutlineChevronLeft className="w-4 h-4" /> Précédent
                    </Button>
                    <div className="flex gap-1">
                      {Array.from(
                        { length: meta.last_page },
                        (_, i) => i + 1,
                      ).map((p) => (
                        <Button
                          key={p}
                          variant={p === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(p)}
                        >
                          {p}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(page + 1)}
                      disabled={page === meta.last_page}
                    >
                      Suivant <HiOutlineChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <IncidentFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        incident={editingIncident}
        onSubmit={(data) => {
          if (editingIncident) {
            updateMutation.mutate({ id: editingIncident.id, data });
          } else {
            createMutation.mutate(data);
          }
        }}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Modal suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>
            Supprimer définitivement l'incident{" "}
            <strong>{incidentToDelete?.title}</strong> ?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IncidentsPage;