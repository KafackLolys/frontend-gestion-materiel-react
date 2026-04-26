import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../../../components/ui/sheet";
import { HiBars3 } from "react-icons/hi2";
import { UserAvatar } from "./UserAvatar";
import { Button } from "../../../components/ui/button";
import { useAuth } from "../../../hooks/use-auth";

export const HeaderHome = () => {
  const navigate = useNavigate();
  
  // Gestion de la déconnexion
  const { logout } = useAuth();
  return (
    <header className="w-full bg-gray-100 px-4 md:px-8 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Bouton menu pour ouvrir la sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <HiBars3 className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[350px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="justify-start"
              >
                Connexion
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/about")}
                className="justify-start"
              >
                À propos
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/help")}
                className="justify-start"
              >
                Aide
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/contact")}
                className="justify-start"
              >
                Contact
              </Button>
              <Button
                variant="ghost"
                onClick={logout}
                className="justify-start text-red-600"
              >
                Déconnexion
              </Button>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo et titre */}
        <div className="flex items-center gap-2 ml-5 md:ml-0">
          <img
            src="/src/assets/images/logo-iuc.png"
            alt="Logo"
            className="w-[50px] md:w-[70px] h-auto"
          />
          <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-blue-600">
            IUC Projecteur
          </h1>
        </div>
      </div>

      {/* Popover avec avatar de profil */}
      <UserAvatar />
    </header>
  );
};
