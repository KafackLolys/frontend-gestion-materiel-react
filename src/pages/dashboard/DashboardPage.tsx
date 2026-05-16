// src/pages/DashboardPage.tsx
import { useUser } from "../../hooks/use-user";
import DashboardManager from "./DashboardManager";
import DashboardAdmin from "./DashboardAdmin";
import DashboardLoaner from "./DashboardLoaner";

const DashboardPage = () => {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    // Rediriger vers login si pas d’utilisateur (à implémenter avec useEffect + navigate)
    return <div>Erreur de chargement</div>;
  }

  // Affichage selon le rôle
  switch (user.role) {
    case "admin":
      return <DashboardAdmin />;
    case "manager":
      return <DashboardManager />;
    case "teacher":
    case "student_delegate":
      return <DashboardLoaner />;
    default:
      return <DashboardLoaner />; // fallback emprunteur
  }
};

export default DashboardPage;
