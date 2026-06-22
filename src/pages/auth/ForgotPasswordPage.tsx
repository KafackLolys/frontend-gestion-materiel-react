import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineKey,
} from "react-icons/hi2";
import { IoMailOutline } from "react-icons/io5";
import { forgotPassword, verifyResetCode, resetPassword } from "../../services/auth-service";

type Step = "email" | "code" | "password" | "success";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log(error);
  

  // --- Step 1: Send email ---
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await forgotPassword(email);
      setStep("code");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi du code");
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: Verify code ---
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await verifyResetCode(email, code);
      setStep("password");
    } catch (err: any) {
      setError(err.response?.data?.message || "Code invalide ou expiré");
    } finally {
      setLoading(false);
    }
  };

  // --- Step 3: Reset password ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await resetPassword(email, code, password, passwordConfirmation);
      setStep("success");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la réinitialisation");
    } finally {
      setLoading(false);
    }
  };

  const stepLabels: Record<Step, string> = {
    email: "Email",
    code: "Code de vérification",
    password: "Nouveau mot de passe",
    success: "Succès",
  };

  const stepIndex: Record<Step, number> = {
    email: 1,
    code: 2,
    password: 3,
    success: 4,
  };

  const currentStep = stepIndex[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white">Mot de passe oublié</h2>
            <p className="text-gray-300 text-sm mt-2">
              {step === "email" && "Entrez votre email pour recevoir un code"}
              {step === "code" && "Entrez le code reçu par email"}
              {step === "password" && "Choisissez un nouveau mot de passe"}
              {step === "success" && "Votre mot de passe a été réinitialisé"}
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    currentStep >= s
                      ? "bg-emerald-500 text-white"
                      : "bg-white/10 text-gray-400"
                  }`}
                >
                  {currentStep > s ? <HiOutlineCheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-10 h-0.5 transition-all duration-300 ${
                      currentStep > s ? "bg-emerald-500" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Step: Email */}
          {step === "email" && (
            <form onSubmit={handleSendEmail} className="space-y-5">
              <div className="relative">
                <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Adresse email"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-70"
              >
                {loading ? "Envoi en cours..." : "Envoyer le code"}
              </button>
            </form>
          )}

          {/* Step: Code */}
          {step === "code" && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div className="relative">
                <HiOutlineKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder="Code de vérification"
                  maxLength={6}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400 text-center tracking-[0.5em] font-mono text-lg"
                />
              </div>

              <p className="text-xs text-gray-400 text-center">
                Un code à 6 chiffres vous a été envoyé par email
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-70"
              >
                {loading ? "Vérification..." : "Vérifier le code"}
              </button>
            </form>
          )}

          {/* Step: New password */}
          {step === "password" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="text-sm text-gray-300 ml-1">Nouveau mot de passe</label>
                <div className="relative mt-1">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Au moins 8 caractères"
                    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 ml-1">Confirmer le mot de passe</label>
                <div className="relative mt-1">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Confirmer le mot de passe"
                    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>

              {password && passwordConfirmation && password !== passwordConfirmation && (
                <p className="text-red-400 text-sm">Les mots de passe ne correspondent pas</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-70"
              >
                {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
              </button>
            </form>
          )}

          {/* Step: Success */}
          {step === "success" && (
            <div className="text-center space-y-5">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <HiOutlineCheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200"
              >
                Se connecter
              </button>
            </div>
          )}

          {/* Back / Cancel links */}
          <div className="text-center mt-6">
            {step !== "success" && (
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
              >
                <HiOutlineArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </Link>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()} Projector Hub
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;