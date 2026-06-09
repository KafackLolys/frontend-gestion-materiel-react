// src/pages/dashboard/LoanDetailPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  HiOutlineArrowLeft,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineIdentification,
  HiOutlineAcademicCap,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlinePrinter,
} from "react-icons/hi";
import {
  HiOutlineComputerDesktop,
  HiOutlineExclamationTriangle,
  HiOutlineCpuChip,
} from "react-icons/hi2";
import { LuProjector } from "react-icons/lu";
import { api } from "@/services/api";
import { HeaderDashboard } from "@/pages/components/HeaderDashboard";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface LoanDetail {
  id: number;
  user_id: number;
  projector_id: number | null;
  loan_date: string;
  return_date: string | null;
  classroom: string | null;
  room: string | null;
  cni_number: string;
  status: "pending" | "in_progress" | "completed";
  starting_state: string | null;
  ending_state: string | null;
  teacher_name: string | null;
  created_at: string;
  updated_at: string | null;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  projector?: {
    id: number;
    marque: string;
    ref?: string;
    etat?: string;
    image?: string;
  };
  accessories?: Array<{
    id: number;
    name: string;
    pivot: { quantity: number };
  }>;
}

const getLoanDetail = async (id: string): Promise<LoanDetail> => {
  const { data } = await api.get(`/loans/${id}`);
  return data;
};

const updateLoanStatus = async ({
  id,
  status,
}: {
  id: number;
  status: string;
}) => {
  const { data } = await api.put(`/loans/${id}`, { status });
  return data;
};

const LoanDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: currentUser } = useUser();
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [endingState, setEndingState] = useState("");

  // Récupération des détails de l'emprunt
  const {
    data: loan,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["loan", id],
    queryFn: () => getLoanDetail(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (loan?.ending_state) {
      setEndingState(loan.ending_state);
    }
  }, [loan]);

  // Mutation pour changer le statut
  const updateStatusMutation = useMutation({
    mutationFn: updateLoanStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loan", id] });
      queryClient.invalidateQueries({ queryKey: ["all-loans"] });
      toast.success("Statut mis à jour avec succès");
      setIsStatusDialogOpen(false);
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Erreur lors de la mise à jour",
      );
    },
  });

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
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (status: string) => (
    <Badge className={`${getStatusColor(status)} border text-sm px-3 py-1`}>
      {getStatusLabel(status)}
    </Badge>
  );

  const openStatusDialog = (status: string) => {
    setSelectedStatus(status);
    setIsStatusDialogOpen(true);
  };

  const confirmStatusUpdate = () => {
    if (selectedStatus === "completed" && !endingState.trim()) {
      toast.error("Veuillez décrire l'état de retour du matériel");
      return;
    }
    updateStatusMutation.mutate({
      id: parseInt(id!),
      status: selectedStatus,
      ...(selectedStatus === "completed" && { ending_state: endingState }),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-50 to-gray-200">
        <HeaderDashboard
          icon={<HiOutlineComputerDesktop className="w-8 h-8 text-blue-600" />}
          title="Détail de l'emprunt"
          role={currentUser?.role}
        />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-50 to-gray-200">
        <HeaderDashboard
          icon={<HiOutlineComputerDesktop className="w-8 h-8 text-blue-600" />}
          title="Détail de l'emprunt"
          role={currentUser?.role}
        />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <HiOutlineExclamationTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800">
                Emprunt non trouvé
              </h2>
              <p className="text-gray-500 mt-2">
                L'emprunt que vous recherchez n'existe pas.
              </p>
              <Button
                onClick={() => navigate("/dashboard/manager")}
                className="mt-6"
              >
                Retour au tableau de bord
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isReturnPossible = loan.status === "in_progress";
  const isValidatePossible = loan.status === "pending";
  const isCompleted = loan.status === "completed";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-50 to-gray-200">
      <HeaderDashboard
        icon={<HiOutlineComputerDesktop className="w-8 h-8 text-blue-600" />}
        title="Détail de l'emprunt"
        role={currentUser?.role}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="rounded-full"
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Emprunt #{loan.id}
              </h1>
              <p className="text-sm text-gray-500">
                Créé le {formatDate(loan.created_at)} à{" "}
                {formatTime(loan.created_at)}
              </p>
            </div>
          </div>
          {getStatusBadge(loan.status)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale - Informations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations emprunteur */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HiOutlineUser className="w-5 h-5 text-blue-500" />
                  Informations emprunteur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">
                      Nom complet
                    </p>
                    <p className="font-medium text-gray-800">
                      {loan.user?.first_name} {loan.user?.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Email</p>
                    <p className="font-medium text-gray-800">
                      {loan.user?.email}
                    </p>
                  </div>
                </div>
                <div
                  className={`grid grid-cols-${loan.teacher_name ? 2 : 1} gap-4`}
                >
                  <div>
                    <p className="text-xs text-gray-500 uppercase">
                      Numéro CNI
                    </p>
                    <p className="font-medium text-gray-800">
                      {loan.cni_number}
                    </p>
                  </div>
                  {loan.teacher_name && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase">
                        Professeur
                      </p>
                      <p className="font-medium text-gray-800">
                        {loan.teacher_name}
                      </p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Classe</p>
                    <p className="font-medium text-gray-800">
                      {loan.classroom || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Salle</p>
                    <p className="font-medium text-gray-800">
                      {loan.room || "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations matériel */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <LuProjector className="w-5 h-5 text-blue-500" />
                  Matériel emprunté
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loan.projector && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">
                      Projecteur
                    </p>
                    <p className="font-medium text-gray-800">
                      {loan.projector.marque}
                    </p>
                    {loan.projector.ref && (
                      <p className="text-xs text-gray-500 mt-1">
                        Réf: {loan.projector.ref}
                      </p>
                    )}
                    {loan.projector.image && (
                      <img
                        src={`http://localhost:8000/${loan.projector.image}`}
                        alt={loan.projector.marque}
                        className="w-24 h-24 object-cover"
                      />
                    )}
                  </div>
                )}
                {loan.accessories && loan.accessories.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">
                      Accessoires
                    </p>
                    <div
                      className={`mt-1 ${
                        loan.accessories.length > 1
                          ? "grid grid-cols-2 gap-4 w-full"
                          : ""
                      }`}
                    >
                      {loan.accessories.map((acc) => (
                        <p key={acc.id} className="text-sm text-gray-700">
                          {acc.name} × {acc.pivot.quantity}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* États */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HiOutlineDocumentText className="w-5 h-5 text-blue-500" />
                  États du matériel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    État initial
                  </p>
                  <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded-lg">
                    {loan.starting_state || "Non renseigné"}
                  </p>
                </div>
                {loan.ending_state && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">
                      État de retour
                    </p>
                    <p className="text-sm text-gray-700 mt-1 p-3 bg-gray-50 rounded-lg">
                      {loan.ending_state}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale - Actions */}
          <div className="space-y-6">
            {/* Dates */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <HiOutlineCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">
                      Date d'emprunt
                    </p>
                    <p className="font-medium">{formatDate(loan.loan_date)}</p>
                    <p className="text-xs text-gray-400">
                      {formatTime(loan.loan_date)}
                    </p>
                  </div>
                </div>
                {loan.return_date && (
                  <div className="flex items-center gap-3">
                    <HiOutlineClock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">
                        Date de retour
                      </p>
                      <p className="font-medium">
                        {formatDate(loan.return_date)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatTime(loan.return_date)}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            {!isCompleted && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isValidatePossible && (
                    <Button
                      onClick={() => openStatusDialog("in_progress")}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <HiOutlineCheckCircle className="w-4 h-4 mr-2" />
                      Valider la demande
                    </Button>
                  )}
                  {isReturnPossible && (
                    <Button
                      onClick={() => openStatusDialog("completed")}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <HiOutlineCheckCircle className="w-4 h-4 mr-2" />
                      Confirmer le retour
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => window.print()}
                    className="w-full"
                  >
                    <HiOutlinePrinter className="w-4 h-4 mr-2" />
                    Imprimer
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Rappel */}
            {!isCompleted && (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
                <div className="flex items-start gap-3">
                  <HiOutlineExclamationTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800">Important</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      {isValidatePossible
                        ? "La validation de la demande rend le matériel indisponible pour d'autres emprunteurs."
                        : "Lors du retour, vérifiez l'état du matériel avant de valider."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Dialog de confirmation */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedStatus === "in_progress"
                ? "Valider la demande d'emprunt"
                : "Confirmer le retour du matériel"}
            </DialogTitle>
            <DialogDescription>
              {selectedStatus === "in_progress"
                ? "Êtes-vous sûr de vouloir valider cette demande d'emprunt ? Le matériel deviendra indisponible."
                : "Veuillez confirmer que le matériel a été retourné en bon état."}
            </DialogDescription>
          </DialogHeader>

          {selectedStatus === "completed" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">État de retour</label>
              <Textarea
                placeholder="Décrivez l'état du matériel au retour..."
                value={endingState}
                onChange={(e) => setEndingState(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={confirmStatusUpdate}
              disabled={updateStatusMutation.isPending}
              className={
                selectedStatus === "in_progress"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            >
              {updateStatusMutation.isPending ? "Chargement..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoanDetailPage;
