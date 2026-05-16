// src/home/components/AvatarUploader.tsx
import { useState, useRef } from "react";
import { HiOutlineCamera, HiOutlineUserCircle } from "react-icons/hi2";
import { uploadAvatar } from "../../../services/user-service";
import { useUser } from "../../../hooks/use-user";

interface AvatarUploaderProps {
  size?: string; // classes Tailwind (ex: 'w-24 h-24')
}

export const AvatarUploader = ({ size = "w-24 h-24" }: AvatarUploaderProps) => {
  const { data: user, refetch } = useUser();
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Utilise l'image stockée dans le backend (user.image_profil)
  const avatarUrl = user?.image_profil || null;
  const backend = import.meta.env.VITE_BACKEND_URL;
  const displayImage = preview || `${backend}${avatarUrl}`;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Prévisualisation locale
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    try {
      await uploadAvatar(file);
      // Recharger l'utilisateur pour obtenir la nouvelle image_url
      await refetch();
      setPreview(null); // la preview disparaît car user.image_url est mise à jour
    } catch (err) {
      console.error("Upload error", err);
      alert("Erreur lors du téléchargement de l'image");
      setPreview(null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative group cursor-pointer" onClick={triggerFileInput}>
      {displayImage ? (
        <img
          src={displayImage}
          alt="Avatar"
          className={`${size} rounded-full object-cover border-4 border-white shadow-lg`}
        />
      ) : (
        <div
          className={`${size} rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg`}
        >
          <HiOutlineUserCircle className="w-12 h-12 text-gray-400" />
        </div>
      )}

      {/* Overlay au survol */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        {uploading ? (
          <div className="text-white text-sm animate-pulse">Upload...</div>
        ) : (
          <HiOutlineCamera className="w-6 h-6 text-white" />
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/jpg"
        className="hidden"
      />
    </div>
  );
};
