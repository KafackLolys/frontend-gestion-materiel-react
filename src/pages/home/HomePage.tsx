import { useNavigate } from "react-router-dom";
// Icônes Heroicons v2
import {
  HiOutlineUserPlus,        // Création de compte / inscription
  HiOutlineMagnifyingGlass, // Consultation / recherche
  HiOutlineCalendarDays,    // Réservation / calendrier
  HiOutlineCheckBadge,      // Validation / approbation
  HiOutlineGift,            // Récupération / matériel
  HiOutlineArrowPath,       // Retour / échange
  HiOutlineRectangleGroup,  // Dashboard (feature)
  HiOutlineComputerDesktop, // Parc projecteurs (feature)
  HiOutlineClock,           // Historique (feature)
  HiOutlineBellAlert,       // Alertes (feature)
} from "react-icons/hi2";
import { PiIdentificationBadgeThin } from "react-icons/pi";
import { FaBook } from "react-icons/fa";


import { HeaderHome } from "./components/HeaderHome";
import { useUser } from "@/hooks/use-user";

// Composants Shadcn/ui


const HomePage = () => {
  const { data: user } = useUser();
  const navigate = useNavigate();

  // Étapes du processus d'emprunt avec leurs icônes respectives
  const etapes = [
    {
      titre: "Se connecter",
      description: "Connectez-vous à votre espace personnel.",
      icone: PiIdentificationBadgeThin,
    },
    {
      titre: "Consulter la liste",
      description: "Voyez les projecteurs disponibles en temps réel.",
      icone: HiOutlineMagnifyingGlass,
    },
    {
      titre: "Réserver",
      description: "Choisissez un projecteur et une plage horaire.",
      icone: HiOutlineCalendarDays,
    },
    {
      titre: "Validation gestionnaire",
      description: "Signalez votre demande au service technique pour validation.",
      icone: HiOutlineCheckBadge,
    },
    {
      titre: "Récupérer",
      description: "Récupérez le projecteur au service technique (muni de votre carte).",
      icone: HiOutlineGift,
    },
    {
      titre: "Restituer",
      description: "Retournez le matériel et confirmez la restitution en ligne.",
      icone: HiOutlineArrowPath,
    },
  ];

  // Badges / fonctionnalités (style moderne)
  const fonctionnalites = [
    { nom: "Dashboard", icone: HiOutlineRectangleGroup, path: "/dashboard" },
    { nom: "Parc projecteurs", icone: HiOutlineComputerDesktop, path: "/dashboard/admin/projectors" },
    { nom: "Historique", icone: HiOutlineClock, path: "/dashboard/admin/borrowings" },
    { nom: "Notifications", icone: HiOutlineBellAlert, path: "/dashboard/admin/reservations" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <HeaderHome />
      <main className="max-w-7xl mx-auto  px-4 py-8 md:px-8">
        {/* En-tête avec titre et description */}
        <div className="text-center mb-8">

          <p className="text-gray-500 text-sm md:text-base mt-2">
            Gestion d'emprunt de projecteurs – Campus IUC
          </p>
        </div>

        {/* Badges fonctionnalités */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {user && fonctionnalites.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <item.icone className="w-4 h-4" />
              {item.nom}
            </button>
          ))}
        </div>

        {/* Titre de la section "Mode d'emploi" */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBook className="text-blue-600 size-5" /> Comment emprunter un projecteur ?
          </h2>
          <p className="text-gray-500 mt-4">Suivez ces étapes simples en quelques minutes</p>
        </div>

        {/* Grille des 6 étapes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {etapes.map((etape, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-5 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                {/* Icône React Icons dynamique */}
                <etape.icone className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition" />
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition">
                  {etape.titre}
                </h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">
                {etape.description}
              </p>
              <div className="mt-4 text-xs text-gray-400">
                Étape {idx + 1}/6
              </div>
            </div>
          ))}
        </div>


        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/register")}
            className="px-7 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md transition hover:scale-[1.03] flex items-center justify-center gap-2"
          >
            <HiOutlineUserPlus className="w-5 h-5" />
            S’inscrire
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-7 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition hover:scale-[1.03] flex items-center justify-center gap-2"
          >
            <HiOutlineCheckBadge className="w-5 h-5" />
            Se connecter
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-gray-400 border-t border-gray-200 pt-6">
          © {new Date().getFullYear()} IUC Projecteur — Gestion d’emprunt de projecteurs
        </div>
      </main>
    </div>
  );
};

export default HomePage;