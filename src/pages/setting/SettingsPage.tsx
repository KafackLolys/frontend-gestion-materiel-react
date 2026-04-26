// src/pages/SettingsPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash, HiOutlineCheckCircle, HiOutlineExclamationCircle } from "react-icons/hi2";
import { updatePassword } from "../../services/user-service";

interface PasswordFormValues {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

const SettingsPage = () => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<PasswordFormValues>();

  const newPassword = watch("new_password");

  const onSubmit = async (data: PasswordFormValues) => {
    setIsUpdating(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await updatePassword({
        current_password: data.current_password,
        new_password: data.new_password,
        new_password_confirmation: data.new_password_confirmation,
      });
      setSuccessMessage("Mot de passe mis à jour avec succès !");
      reset(); // vider le formulaire
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Erreur lors du changement de mot de passe");
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Paramètres du compte</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Retour
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <HiOutlineLockClosed className="w-5 h-5 text-blue-500" />
            Changer le mot de passe
          </h2>

          {successMessage && (
            <div className="mb-6 flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl">
              <HiOutlineCheckCircle className="w-5 h-5" />
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-6 flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl">
              <HiOutlineExclamationCircle className="w-5 h-5" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Mot de passe actuel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showCurrent ? "text" : "password"}
                  {...register("current_password", { required: "Le mot de passe actuel est requis" })}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                </button>
              </div>
              {errors.current_password && <p className="text-red-500 text-sm mt-1">{errors.current_password.message}</p>}
            </div>

            {/* Nouveau mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showNew ? "text" : "password"}
                  {...register("new_password", {
                    required: "Le nouveau mot de passe est requis",
                    minLength: { value: 8, message: "Minimum 8 caractères" },
                  })}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                </button>
              </div>
              {errors.new_password && <p className="text-red-500 text-sm mt-1">{errors.new_password.message}</p>}
            </div>

            {/* Confirmation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  {...register("new_password_confirmation", {
                    required: "Veuillez confirmer le mot de passe",
                    validate: (value) => value === newPassword || "Les mots de passe ne correspondent pas",
                  })}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                </button>
              </div>
              {errors.new_password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.new_password_confirmation.message}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-70"
              >
                {isUpdating ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;