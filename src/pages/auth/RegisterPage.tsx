// src/pages/RegisterPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineUserPlus,
} from "react-icons/hi2";
import { IoMailOutline } from "react-icons/io5";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useAuth } from "../../hooks/use-auth";

const RegisterPage = () => {
  const { handleRegister, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "password" || e.target.name === "password_confirmation") {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }

    if (!formData.role) {
      alert("Veuillez sélectionner votre statut");
      return;
    }

    // Appel API réel
    await handleRegister({
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Créez votre compte</h2>
            <p className="text-gray-300 text-sm mt-2">Rejoignez la plateforme IUC</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nom (last_name) */}
            <InputField
              icon={<HiOutlineUser />}
              name="last_name"
              placeholder="Nom"
              value={formData.last_name}
              onChange={handleChange}
            />

            {/* Prénom (first_name) */}
            <InputField
              icon={<HiOutlineUser />}
              name="first_name"
              placeholder="Prénom"
              value={formData.first_name}
              onChange={handleChange}
            />

            {/* Email */}
            <InputField
              icon={<IoMailOutline />}
              name="email"
              type="email"
              placeholder="exemple@iuc.fr"
              value={formData.email}
              onChange={handleChange}
            />

            {/* Statut */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300 ml-1">Statut</label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="w-full py-3 h-[48.8px]! bg-white/10 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-emerald-500">
                  <SelectValue placeholder="Sélectionner votre statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student_delegate">Étudiant</SelectItem>
                  <SelectItem value="teacher">Enseignant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mot de passe */}
            <PasswordField
              label="Mot de passe"
              name="password"
              value={formData.password}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
              onChange={handleChange}
            />

            {/* Confirmation */}
            <PasswordField
              label="Confirmer le mot de passe"
              name="password_confirmation"
              value={formData.password_confirmation}
              show={showConfirmPassword}
              toggle={() => setShowConfirmPassword(!showConfirmPassword)}
              onChange={handleChange}
            />

            {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? "Inscription..." : "Créer mon compte"}
              <HiOutlineUserPlus className="w-5 h-5" />
            </button>
          </form>

          <p className="text-center text-gray-300 mt-6">
            Déjà inscrit ?{" "}
            <Link to="/login" className="text-emerald-400 font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()} Projector Hub
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

// Composants réutilisables
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

const PasswordField = ({ label, name, value, show, toggle, onChange }: any) => (
  <div>
    <label className="text-sm text-gray-300 ml-1">{label}</label>
    <div className="relative mt-1">
      <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        minLength={8}
        required
        className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
      >
        {show ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
      </button>
    </div>
  </div>
);