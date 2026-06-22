import { Link } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi2";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10 text-center">
          {/* Error code */}
          <div className="mb-4">
            <span className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              404
            </span>
          </div>

          {/* Separator */}
          <div className="w-16 h-1 bg-emerald-500/50 mx-auto rounded-full mb-6" />

          {/* Message */}
          <h2 className="text-2xl font-bold text-white mb-2">
            Page introuvable
          </h2>
          <p className="text-gray-300 text-sm mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>

          {/* Home button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200"
          >
            <HiOutlineHome className="w-5 h-5" />
            Retour à l'accueil
          </Link>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()} Projector Hub
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;