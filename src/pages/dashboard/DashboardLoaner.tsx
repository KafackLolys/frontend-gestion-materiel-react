// DashboardLoaner.tsx
import { useNavigate } from "react-router-dom";
import {
  HiOutlineClock,
  HiOutlineExclamationTriangle,
  HiOutlineCalendarDays,
  HiOutlineTrash,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { LuProjector } from "react-icons/lu";
import { useUser } from "../../hooks/use-user";
import { useUserLoans } from "../../hooks/use-user-loans";
import { HeaderDashboard } from "../components/HeaderDashboard";
import { useEffect, useState } from "react";
import { cancelLoan, updateLoan } from "../loans/actions/loan";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const DashboardLoaner = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const { data: loansData, isLoading } = useUserLoans();
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [endingState, setEndingState] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeLoan = loansData?.data?.active_loan;
  const history = loansData?.data?.history || [];

  useEffect(() => {
    if (activeLoan?.ending_state) {
      setEndingState(activeLoan.ending_state);
    }
  }, [activeLoan]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCancelLoan = async () => {
    if (!activeLoan) return;

    const isConfirmed = window.confirm(
      "Êtes-vous sûr de vouloir annuler cette demande d'emprunt ?",
    );
    if (!isConfirmed) return;

    try {
      setIsCancelling(true);
      await cancelLoan(activeLoan.id);

      queryClient.invalidateQueries({ queryKey: ["user-loans"] });
      queryClient.invalidateQueries({ queryKey: ["active-loan"] });

      toast.success("Demande annulée avec succès");
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erreur lors de l'annulation";
      toast.error(message);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleOpenReturnModal = () => {
    setIsReturnModalOpen(true);
  };

  const handleSubmitReturn = async () => {
    if (!activeLoan) return;

    if (!endingState.trim()) {
      toast.error("Veuillez décrire l'état de retour du matériel");
      return;
    }

    try {
      setIsSubmitting(true);

      await updateLoan(activeLoan.id, {
        ending_state: endingState,
      });

      queryClient.invalidateQueries({ queryKey: ["user-loans"] });
      queryClient.invalidateQueries({ queryKey: ["active-loan"] });

      toast.success("Information d'emprunt completer avec succès.");
      setIsReturnModalOpen(false);
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erreur lors de l'état de retour";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Chargement de vos emprunts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100">
      <HeaderDashboard
        icon={<LuProjector className="w-8 h-8 text-blue-600" />}
        title="Mon espace emprunt – IUC"
        role={user?.role}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Emprunt actif / demande en attente */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center gap-3">
                  <HiOutlineClock className="w-7 h-7" />
                  <div>
                    <h2 className="text-2xl font-bold">
                      {activeLoan?.status === "pending"
                        ? "Demande en attente"
                        : activeLoan?.status === "in_progress"
                          ? "Emprunt actuellement actif"
                          : "Aucun emprunt actif"}
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                      Un seul emprunt simultané est autorisé
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {!activeLoan ? (
                  <div className="text-center py-10">
                    <LuProjector className="w-14 h-14 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      Aucun projecteur emprunté actuellement.
                    </p>
                    <button
                      onClick={() => navigate("/dashboard/student/loan")}
                      className="mt-6 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                    >
                      Faire une demande
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          {activeLoan.status === "pending"
                            ? "Projecteur demandé"
                            : "Projecteur emprunté"}
                        </p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">
                          {activeLoan.projector?.marque || "Projecteur"}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                            activeLoan.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : activeLoan.status === "in_progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {activeLoan.status === "pending"
                            ? "En attente"
                            : activeLoan.status === "in_progress"
                              ? "En cours"
                              : "Terminé"}
                        </span>

                        {/* Bouton d'annulation - visible uniquement pour les demandes en attente */}
                        {activeLoan.status === "pending" && (
                          <button
                            onClick={handleCancelLoan}
                            disabled={isCancelling}
                            className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition disabled:opacity-50"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                            {isCancelling
                              ? "Annulation..."
                              : "Annuler la demande"}
                          </button>
                        )}

                        {/* ✅ Bouton de retour - visible uniquement pour les emprunts en cours */}
                        {activeLoan.status === "in_progress" && (
                          <button
                            onClick={handleOpenReturnModal}
                            className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-700 hover:bg-green-200 transition"
                          >
                            <HiOutlineCheckCircle className="w-4 h-4" />
                            Etat de restitution
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-2xl p-4">
                        <p className="text-xs uppercase text-gray-400 mb-1">
                          Date de la demande
                        </p>
                        <p className="font-semibold text-gray-800">
                          {formatDate(activeLoan.loan_date)}
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4">
                        <p className="text-xs uppercase text-gray-400 mb-1">
                          Heure de la demande
                        </p>
                        <p className="font-semibold text-gray-800">
                          {formatTime(activeLoan.loan_date)}
                        </p>
                      </div>
                    </div>

                    {/* État initial */}
                    {activeLoan.starting_state && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs uppercase text-gray-400 mb-1">
                          État initial du matériel
                        </p>
                        <p className="text-sm text-gray-700">
                          {activeLoan.starting_state}
                        </p>
                      </div>
                    )}

                    {activeLoan.status === "pending" ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <p className="text-sm text-yellow-700">
                          Votre demande est en attente de validation par le
                          gestionnaire. Vous pouvez l'annuler tant qu'elle n'a
                          pas été approuvée.
                        </p>
                      </div>
                    ) : activeLoan.status === "in_progress" ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-sm text-blue-700">
                          Vous avez actuellement un projecteur en votre
                          possession. N'oubliez pas de renseigner l'état du
                          matériel lors de la restitution.
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Historique */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <HiOutlineCalendarDays className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-bold text-gray-800">
                  Historique récent
                </h2>
              </div>

              <div className="space-y-4">
                {history.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Aucun historique d'emprunt
                  </p>
                ) : (
                  history.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-100 rounded-2xl p-4 hover:bg-slate-50 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {item.projector?.marque || "Projecteur"}
                            {item.projector?.ref
                              ? " | " + item.projector.ref
                              : ""}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            <i>
                              emprunté le : <b>{formatDate(item.loan_date)}</b>
                            </i>{" "}
                            à {formatTime(item.loan_date)}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            item.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : item.status === "in_progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.status === "pending"
                            ? "En attente"
                            : item.status === "in_progress"
                              ? "En cours"
                              : "Terminé"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {history.length > 0 && (
                <button
                  className="mt-5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => navigate("/student/historique-emprunts")}
                >
                  Voir tout l’historique →
                </button>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <HiOutlineExclamationTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-800">Important</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Merci de restituer le projecteur au service technique avant
                    la fin de la journée afin d’éviter des pénalités.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
          © 2025 Projector Hub – Gestion d'emprunt
        </footer>
      </main>

      {/* ✅ Modal pour signaler le retour */}
      <Dialog open={isReturnModalOpen} onOpenChange={setIsReturnModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Signaler le retour du matériel</DialogTitle>
            <DialogDescription>
              Veuillez décrire l'état actuel du matériel que vous retournez.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ending_state">État de retour</Label>
              <Textarea
                id="ending_state"
                placeholder="Ex: Projecteur en bon état, télécommande fonctionnelle, câble HDMI présent..."
                value={endingState}
                onChange={(e) => setEndingState(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Décrivez précisément l'état du matériel (projecteur, câbles,
                télécommande, etc.)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReturnModalOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmitReturn}
              disabled={isSubmitting || !endingState.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardLoaner;
