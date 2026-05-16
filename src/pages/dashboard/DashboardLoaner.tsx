// src/pages/DashboardEmprunteur.tsx
import { useNavigate } from "react-router-dom";
import {
  HiOutlineClock,
  HiOutlineExclamationTriangle,
  HiOutlineCalendar,
} from "react-icons/hi2";
import { LuProjector } from "react-icons/lu";
import { useUser } from "../../hooks/use-user";
import { HeaderDashboard } from "../components/HeaderDashboard";

interface EmpruntActif {
  id: number;
  projecteur: string;
  dateEmprunt: string;
  dateRetourPrevue: string;
  statut: "en_cours" | "en_retard";
}

const DashboardLoaner = () => {
  const navigate = useNavigate();
  const { data: user } = useUser();

  // Données simulées pour un emprunteur
  const empruntsActifs: EmpruntActif[] = [
    {
      id: 1,
      projecteur: "Epson EB‑695Wi",
      dateEmprunt: "2025-04-24",
      dateRetourPrevue: "2025-04-26",
      statut: "en_retard",
    },
    {
      id: 2,
      projecteur: "BenQ TH671ST",
      dateEmprunt: "2025-04-25",
      dateRetourPrevue: "2025-04-27",
      statut: "en_cours",
    },
  ];

  const demandesEnAttente = [
    { id: 1, projecteur: "Optoma GT1080HDR", dateDemande: "2025-04-26" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-50 to-gray-200">
      <HeaderDashboard
        icon={<LuProjector className="w-8 h-8 text-blue-600" />}
        title="Mon espace emprunt – IUC"
        role={user?.role}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Emprunts en cours */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <HiOutlineClock className="w-5 h-5 text-blue-500" />
              Mes emprunts en cours
            </h2>
            {empruntsActifs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucun emprunt actif.
              </p>
            ) : (
              <div className="space-y-4">
                {empruntsActifs.map((emprunt) => (
                  <div
                    key={emprunt.id}
                    className="flex justify-between items-center border-b border-gray-100 pb-4"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {emprunt.projecteur}
                      </p>
                      <p className="text-xs text-gray-500">
                        Emprunté le {emprunt.dateEmprunt}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Retour prévu : {emprunt.dateRetourPrevue}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          emprunt.statut === "en_retard"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {emprunt.statut === "en_retard"
                          ? "En retard"
                          : "En cours"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Demandes en attente + actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <HiOutlineCalendar className="w-5 h-5 text-orange-500" />
                Demandes en attente
              </h2>
              {demandesEnAttente.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Aucune demande en attente.
                </p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {demandesEnAttente.map((demande) => (
                    <li key={demande.id} className="py-2 flex justify-between">
                      <span>{demande.projecteur}</span>
                      <span className="text-xs text-gray-400">
                        {demande.dateDemande}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => navigate("/nouvel-emprunt")}
                className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium"
              >
                ➕ Nouvelle demande d’emprunt
              </button>
            </div>

            {/* Règles rappel */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
              <h3 className="font-semibold text-amber-800 flex items-center gap-2">
                <HiOutlineExclamationTriangle className="w-5 h-5" />
                Rappel
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                Emprunt max 48h. Retard = pénalité. Restitution au service
                technique.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
          © 2025 IUC Projecteur – Gestion d'emprunt
        </footer>
      </main>
    </div>
  );
};

export default DashboardLoaner;
