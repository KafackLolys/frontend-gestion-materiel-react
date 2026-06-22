// src/pages/admin/ProjectorsPage.tsx
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
  HiSortAscending,
  HiSortDescending,
  HiOutlinePhotograph,
} from "react-icons/hi";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { toast } from "react-hot-toast";
import debounce from "lodash.debounce";

import { HeaderDashboard } from "../../components/HeaderDashboard";
import { useProjectors, type ProjectorSortColumn } from "@/hooks/use-projector";
import type { Projector } from "@/types/projector";
import {
  createProjector,
  updateProjector,
  deleteProjector,
} from "@/services/projector-service";

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
import { LuProjector } from "react-icons/lu";
import { ProjectorFormModal } from "./ProjectorFormModalProps";
import { BACKEND_URL } from "@/services/api";

type SortOrder = "asc" | "desc" | null;

const ProjectorsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjector, setEditingProjector] = useState<Projector | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectorToDelete, setProjectorToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<ProjectorSortColumn | null>(
    null,
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [page, setPage] = useState(1);
  const [resetFormFn, setResetFormFn] = useState<(() => void) | null>(null);

  const { data: currentUser } = useUser();

  const queryParams = {
    page,
    per_page: 10,
    search: search || undefined,
    sort_by: sortColumn || undefined,
    ...(sortOrder !== null && { order: sortOrder }),
  };

  const { projectors, isLoading, error, meta } = useProjectors(queryParams);

  const debouncedSetSearch = useCallback(
    debounce((value: string) => setSearch(value), 500),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  const handleSort = (column: ProjectorSortColumn) => {
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

  const getSortIcon = (column: ProjectorSortColumn) => {
    if (sortColumn !== column) return <HiSortAscending className="w-4 h-4" />;
    if (sortOrder === "asc") return <HiSortAscending className="w-4 h-4" />;
    if (sortOrder === "desc") return <HiSortDescending className="w-4 h-4" />;
    return <HiSortAscending className="w-4 h-4" />;
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= (meta?.last_page[0] ?? 1)) {
      setPage(newPage);
    }
  };
  // Mutations avec FormData
  const createMutation = useMutation({
    mutationFn: createProjector,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectors"] });
      toast.success("Projecteur créé");
      if (resetFormFn) {
        resetFormFn(); // réinitialise les champs du formulaire
      }
      handleCloseModal();
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erreur lors de la création";
      console.log(message);

      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateProjector(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectors"] });
      toast.success("Projecteur modifié");
      handleCloseModal();
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erreur lors de la création";
      console.log(message);

      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProjector,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectors"] });
      toast.success("Projecteur supprimé");
      setIsDeleteDialogOpen(false);
      setProjectorToDelete(null);
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erreur lors de la création";
      console.log(message);

      toast.error(message);
    },
  });

  const handleOpenModal = (projector?: Projector) => {
    setEditingProjector(projector || null);
    setImagePreview(projector?.image || null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProjector(null);
    setImagePreview(null);
    setImageFile(null);
    setIsModalOpen(false);
  };

  const confirmDelete = (id: number, name: string) => {
    setProjectorToDelete({ id, name });
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (projectorToDelete) deleteMutation.mutate(projectorToDelete.id);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <HeaderDashboard
        icon={<LuProjector className="w-8 h-8 text-blue-600" />}
        title="Gestion des projecteurs"
        role={currentUser?.role}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800">
            Projecteurs
          </h1>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative w-full sm:w-64">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher par marque ou description"
                className="pl-10"
                onChange={(e) => debouncedSetSearch(e.target.value)}
              />
            </div>
            <Button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 h-10 px-5"
            >
              <HiOutlinePlus className="w-5 h-5 mr-2" />
              Ajouter
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
            {projectors.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Aucun projecteur
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort("ref")}
                      >
                        <div className="flex items-center gap-2">
                          Ref {getSortIcon("ref")}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort("marque")}
                      >
                        <div className="flex items-center gap-2">
                          Marque {getSortIcon("marque")}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Description
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort("etat")}
                      >
                        <div className="flex items-center gap-2">
                          État {getSortIcon("etat")}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Image
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectors.map((projector) => (
                      <tr
                        key={projector.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {projector.ref}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {projector.marque}
                        </td>
                        <td className="px-6 py-4 text-sm max-w-xs truncate">
                          {projector.description}
                        </td>
                        <td className="px-6 py-4 text-sm max-w-xs truncate">
                          {projector.etat === "disponible" && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              Disponible
                            </span>
                          )}
                          {projector.etat === "emprunte" && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              Emprunté
                            </span>
                          )}
                          {projector.etat === "en_maintenance" && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                              En maintenance
                            </span>
                          )}
                          {projector.etat === "hors_service" && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                              Hors service
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {projector.image ? (
                            <img
                              src={`${BACKEND_URL}${projector.image}`}
                              alt={projector.marque}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                              <HiOutlinePhotograph className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenModal(projector)}
                            className="text-blue-600"
                          >
                            <HiOutlinePencil className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              confirmDelete(projector.id, projector.marque)
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
                {meta && meta.last_page[0] > 1 && (
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
                        { length: meta.last_page[0] },
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
                      disabled={page === meta.last_page[0]}
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
      <ProjectorFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        projector={editingProjector}
        onSubmit={(formData) => {
          if (editingProjector) {
            updateMutation.mutate({ id: editingProjector.id, formData });
          } else {
            createMutation.mutate(formData);
          }
        }}
        isLoading={createMutation.isPending || updateMutation.isPending}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        onRemoveImage={removeImage}
        imageFile={imageFile}
        setResetForm={setResetFormFn}
      />

      {/* Modal suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>
            Supprimer définitivement <strong>{projectorToDelete?.name}</strong>{" "}
            ?
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

export default ProjectorsPage;
