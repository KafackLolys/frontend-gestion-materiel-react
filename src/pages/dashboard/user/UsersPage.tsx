// src/pages/admin/UsersPage.tsx
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
  HiSortAscending,
  HiSortDescending,
} from "react-icons/hi";
import { toast } from "react-hot-toast";
import {
  createUser,
  updateUser,
  deleteUser,
} from "../../../services/user-service";
import { HeaderDashboard } from "../../components/HeaderDashboard";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineMagnifyingGlass,
  HiOutlineUsers,
} from "react-icons/hi2";
import { useUser, useUsers, type SortColumn } from "@/hooks/use-user";
import type { User } from "@/types/user";
import debounce from "lodash.debounce";

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
import { UserFormModal } from "./UserFormModal";


const roleOptions = [
  { value: "student_delegate", label: "Délégué étudiant" },
  { value: "admin", label: "Administrateur" },
  { value: "manager", label: "Gérant" },
  { value: "teacher", label: "Enseignant" },
];

type SortOrder = "asc" | "desc" | null;

const UsersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const queryClient = useQueryClient();
  // États pour la recherche et le tri
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [page, setPage] = useState(1);

  const { data: currentUser } = useUser();
  // Construction des paramètres pour le hook
  const queryParams = {
    page: page,
    per_page: 10,
    search: search || undefined,
    sort_by: sortColumn || undefined,
    ...(sortOrder !== null && { order: sortOrder }), // ✅ conditionnel
  };

  const { users, isLoading, error, meta } = useUsers(queryParams);
  console.log("meta", meta);

  // Debounce sur la recherche
  const debouncedSetSearch = useCallback(
    debounce((value: string) => setSearch(value), 500),
    [],
  );
  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  // Gestion du tri sur colonne
  const handleSort = (column: SortColumn) => {
    if (sortColumn !== column) {
      // nouvelle colonne → tri asc
      setSortColumn(column);
      setSortOrder("asc");
    } else {
      // même colonne
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        // reset : plus de tri
        setSortColumn(null);
        setSortOrder(null);
      }
    }
  };

  // Rendu de l'icône de tri dans l'en-tête
  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) return <HiSortAscending className="w-4 h-4" />;
    if (sortOrder === "asc") return <HiSortAscending className="w-4 h-4" />;
    if (sortOrder === "desc") return <HiSortDescending className="w-4 h-4" />;
    return <HiSortAscending className="w-4 h-4" />;
  };
  // Pagination helpers
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= (meta?.last_page[0] ?? 1)) {
      setPage(newPage);
    }
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Utilisateur créé");
      handleCloseModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Erreur"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Utilisateur modifié");
      handleCloseModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Erreur"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Utilisateur supprimé");
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Erreur"),
  });

  const handleOpenModal = (user?: User) => {
    setEditingUser(user || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingUser(null);
    setIsModalOpen(false);
  };

  const confirmDelete = (id: number, name: string) => {
    setUserToDelete({ id, name });
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <HeaderDashboard
        icon={<HiOutlineUsers className="w-8 h-8 text-blue-600" />}
        title="Dashboard Projector Hub"
        role={currentUser?.role}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800">
            Gestion des utilisateurs
          </h1>
          {/* Barre de recherche avec debounce */}
          <div className="relative w-full sm:w-80">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher par nom, email, rôle..."
              className="pl-10"
              onChange={(e) => debouncedSetSearch(e.target.value)}
            />
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 h-11 px-5 ml-auto"
          >
            <HiOutlinePlus className="w-5 h-5 mr-2" />
            Ajouter
          </Button>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-8 text-center text-gray-500">Chargement ...</div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-8 text-center text-red-500">
              Erreur: {(error as Error).message}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {users.length === 0 ? (
              // Tableau
              <div className="p-8 text-center text-gray-500">
                Aucun utilisateur
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {/* Colonne Nom */}
                      <th
                        className="px-6 py-3  text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort("last_name")}
                      >
                        <div className="flex items-center gap-2">
                          Nom {getSortIcon("last_name")}
                        </div>
                      </th>
                      {/* Colonne Prénom */}
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort("first_name")}
                      >
                        <div className="flex items-center gap-2">
                          Prénom {getSortIcon("first_name")}
                        </div>
                      </th>
                      {/* Colonne Email */}
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort("email")}
                      >
                        <div className="flex items-center gap-2">
                          Email {getSortIcon("email")}
                        </div>
                      </th>
                      {/* Colonne Rôle */}
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort("role")}
                      >
                        <div className="flex items-center gap-2">
                          Rôle {getSortIcon("role")}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm">
                          {user.last_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm">
                          {user.first_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            {roleOptions.find((r) => r.value === user.role)
                              ?.label || user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {(currentUser?.role === "admin" || (currentUser?.role === "manager" && user.role !== "admin")) && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenModal(user)}
                                className="cursor-pointer text-blue-600"
                            >
                              <HiOutlinePencil className="w-5 h-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                confirmDelete(
                                  user.id,
                                  `${user.last_name} ${user.first_name}`,
                                )
                              }
                              className="cursor-pointer text-red-600"
                            >
                              <HiOutlineTrash className="w-5 h-5" />
                            </Button>
                          </>)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                {meta && meta.last_page[0] > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1}
                    >
                      <HiOutlineChevronLeft className="w-4 h-4" />
                      Précédent
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
                          className={p === page ? "bg-blue-600" : ""}
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
                      Suivant
                      <HiOutlineChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Formulaire (Dialog Shadcn) */}
      <UserFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        user={editingUser}
        onSubmit={(data) => {
          if (editingUser) {
            updateMutation.mutate({ id: editingUser.id, data });
          } else {
            createMutation.mutate(data);
          }
        }}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Modal Confirmation suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>
            Êtes-vous sûr de vouloir supprimer définitivement{" "}
            <strong>{userToDelete?.name}</strong> ?
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

export default UsersPage;
