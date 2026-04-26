import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import { IoMailOutline } from "react-icons/io5";
import { useAuth } from "../../hooks/use-auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { handleLogin, loading, error } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await handleLogin(
      formData.email,
      formData.password
    );

    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10">

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              Bon retour
            </h2>
            <p className="text-gray-300 text-sm mt-2">
              Connectez-vous à votre espace IUC
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-400/30 text-red-300 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <InputField
              icon={<IoMailOutline />}
              type="email"
              name="email"
              placeholder="Adresse email"
              value={formData.email}
              onChange={handleChange}
            />

            {/* Password */}
            <div>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Mot de passe"
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

              {/* Forgot password */}
              <div className="text-right mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-emerald-400 hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? "Connexion..." : "Se connecter"}
              <HiOutlineArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center text-gray-300 mt-6">
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              className="text-emerald-400 font-semibold hover:underline"
            >
              S'inscrire
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()} IUC Projecteur
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

/* 🔧 Input réutilisable */
const InputField = ({ icon, ...props }: any) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
      {icon}
    </div>
    <input
      {...props}
      required
      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400"
    />
  </div>
);