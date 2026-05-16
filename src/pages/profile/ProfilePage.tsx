// src/pages/ProfilePage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  HiOutlineUser,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import { IoMailOutline } from "react-icons/io5";
import { updateProfile } from "../../services/user-service";
import { useUser } from "../../hooks/use-user";
import { AvatarUploader } from "./components/AvatarUploader";

interface ProfileFormValues {
  first_name: string;
  last_name: string;
  email: string;
}

const ProfilePage = () => {
  const { data: user, isLoading, refetch } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>();

  // Remplir le formulaire avec les données utilisateur
  useEffect(() => {
    if (user) {
      setValue("first_name", user.first_name);
      setValue("last_name", user.last_name);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsUpdating(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await updateProfile(data);
      await refetch(); // rafraîchir les données du hook
      setSuccessMessage("Profil mis à jour avec succès !");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Erreur lors de la mise à jour",
      );
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Mon profil</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Retour au tableau de bord
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Bannière avec avatar */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-12 flex justify-center">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <AvatarUploader size="w-24 h-24" />
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            {successMessage && (
              <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl">
                <HiOutlineCheckCircle className="w-5 h-5" />
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl">
                <HiOutlineExclamationCircle className="w-5 h-5" />
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register("first_name", {
                      required: "Le prénom est requis",
                    })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register("last_name", {
                      required: "Le nom est requis",
                    })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.last_name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <div className="relative">
                  <IoMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    {...register("email", {
                      required: "L'email est requis",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Email invalide",
                      },
                    })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-70"
              >
                {isUpdating
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
