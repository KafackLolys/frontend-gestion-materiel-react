import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Button } from "../../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "../../../components/ui/sheet";
import { HiBars3 } from "react-icons/hi2";

export const HeaderHome = () => {
  const navigate = useNavigate();
  // État utilisateur simulé (plus tard viendra d'un contexte d'auth)
  const isLoggedIn = true; // à remplacer par ton auth réelle
  const user = {
    name: "Jean Dupont",
    email: "jean.dupont@iuc.fr",
    avatarUrl: "", // laisse vide pour utiliser les initiales
  };

  // Étapes...

  // Gestion de la déconnexion
  const handleLogout = () => {
    // Logique de déconnexion
    console.log("Déconnexion");
    navigate("/login");
  };
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
                onClick={handleLogout}
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
            className="w-[50px] md:w-[100px] h-auto"
          />
          <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold text-blue-600">
            IUC Projecteur
          </h1>
        </div>
      </div>

      {/* Popover avec avatar de profil */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="relative rounded-full">
            <Avatar className="size-10 md:size-20 shrink-0">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="bg-blue-100 text-blue-800 text-base md:text-xl">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="end">
          <div className="flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <div className="px-2 py-1 text-sm font-medium text-gray-900">
                  {user.name}
                </div>
                <div className="px-2 py-0 text-xs text-gray-500">
                  {user.email}
                </div>
                <hr className="my-1" />
                <Button
                  variant="ghost"
                  onClick={() => navigate("/profile")}
                  className="justify-start"
                >
                  Mon profil
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/settings")}
                  className="justify-start"
                >
                  Paramètres
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="justify-start text-red-600"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/login")} className="w-full">
                Se connecter
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </header>
  );
};
