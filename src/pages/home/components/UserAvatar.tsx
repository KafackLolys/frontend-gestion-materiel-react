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
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../hooks/use-user";
import { useAuth } from "../../../hooks/use-auth";

export const UserAvatar = () => {
  const { data: user } = useUser();
  const userName = `${user?.first_name} ${user?.last_name}`;
  const navigate = useNavigate();

  // Gestion de la déconnexion
  const { logout } = useAuth();
  const backend = import.meta.env.VITE_BACKEND_URL;
  const avatarUrl = `${backend}${user?.image_profil}` || undefined;

  const isLoggedIn = true; // à remplacer par ton auth réelle

  if (!user) {
    return (
      <Button
        onClick={() => navigate("/login")}
        className="w-[150px] cursor-pointer border border-gray-200 bg-white text-gray-500"
      >
        Se connecter
      </Button>
    );
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative rounded-full size-10 md:size-12"
        >
          <Avatar className="size-10 md:size-12 shrink-0">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-blue-100 text-blue-800 text-base">
              {userName
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
                {userName}
              </div>
              <div className="px-2 py-0 text-xs text-gray-500">
                {user?.email}
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
                onClick={logout}
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
  );
};
