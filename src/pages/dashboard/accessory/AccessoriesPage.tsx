import { useCallback, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
  HiSortAscending,
  HiSortDescending,
  HiOutlinePhotograph,
  HiOutlineChip,
} from "react-icons/hi";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { toast } from "react-hot-toast";
import debounce from "lodash.debounce";

import { HeaderDashboard } from "../../components/HeaderDashboard";
import { useAccessories, type AccessorySortColumn } from "@/hooks/use-accessory";
import type { Accessory } from "@/types/accessory";
import {
  createAccessory,
  updateAccessory,
  deleteAccessory,
} from "@/services/accessory-service";

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
import { AccessoryFormModal } from "./AccessoryFormModalProps";
import { BACKEND_URL } from "@/services/api";

type SortOrder = "asc" | "desc" | null;

const AccessoriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accessoryToDelete, setAccessoryToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<AccessorySortColumn | null>(null);
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

  const { accessories, isLoading, error, meta } = useAccessories(queryParams);

  const debouncedSetSearch = useCallback(
    debounce((value: string) => setSearch(value), 500),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  const handleSort = (column: AccessorySortColumn) => {
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

  const getSortIcon = (column: AccessorySortColumn) => {
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

  const createMutation = useMutation({
    mutationFn: createAccessory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessories"] });
      toast.success("Accessoire créé");
      if (resetFormFn) {
        resetFormFn();
      }
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
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateAccessory(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessories"] });
      toast.success("Accessoire modifié");
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

  const deleteMutation = useMutation({
    mutationFn: deleteAccessory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessories"] });
      toast.success("Accessoire supprimé");
      setIsDeleteDialogOpen(false);
      setAccessoryToDelete(null);
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erreur lors de la création";
      toast.error(message);
    },
  });

  const handleOpenModal = (accessory?: Accessory) => {
    setEditingAccessory(accessory || null);
    setImagePreview(accessory?.image || null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingAccessory(null);
    setImagePreview(null);
    setImageFile(null);
    setIsModalOpen(false);
  };

  const confirmDelete = (id: number, name: string) => {
    setAccessoryToDelete({ id, name });
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (accessoryToDelete) deleteMutation.mutate(accessoryToDelete.id);
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
        icon={<HiOutlineChip className="w-8 h-8 text-green-600" />}
        title="Gestion des accessoires"
        role={currentUser?.role}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800">
            Accessoires
          </h1>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative w-full sm:w-64">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un accessoire..."
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
            {accessories.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Aucun accessoire
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center gap-2">
                          Nom {getSortIcon("name")}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort("quantity")}
                      >
                        <div className="flex items-center gap-2">
                          Quantité {getSortIcon("quantity")}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Description
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
                    {accessories.map((accessory) => (
                      <tr
                        key={accessory.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {accessory.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {accessory.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm max-w-xs truncate">
                          {accessory.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {accessory.image ? (
                            <img
                              src={`${BACKEND_URL}${accessory.image}`}
                              alt={accessory.name}
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
                            onClick={() => handleOpenModal(accessory)}
                            className="text-blue-600"
                          >
                            <HiOutlinePencil className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              confirmDelete(accessory.id, accessory.name)
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
      <AccessoryFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        accessory={editingAccessory}
        onSubmit={(formData) => {
          if (editingAccessory) {
            updateMutation.mutate({ id: editingAccessory.id, formData });
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
            Supprimer définitivement <strong>{accessoryToDelete?.name}</strong>{" "}
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

export default AccessoriesPage;
