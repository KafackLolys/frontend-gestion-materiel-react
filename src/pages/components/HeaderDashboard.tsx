import { UserAvatar } from "../home/components/UserAvatar";
import { NotificationBell } from "./NotificationBell";

type HeaderProps = {
  title: string;
  role?: string;
  icon: React.ReactNode;
};
export const HeaderDashboard = ({
  title,
  role,
  icon: Icon
}: HeaderProps) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {Icon}
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:inline capitalize">
            {role === "admin" && "Administrateur"}
            {role === "manager" && "Gérant"}
            {role === "teacher" && "Enseignant"}
            {role === "student_delegate" && "élève"}
          </span>
          <div className="flex items-center gap-3 md:gap-5">
            <NotificationBell />
            <UserAvatar />
          </div>
        </div>
      </div>
    </header>
  );
};
