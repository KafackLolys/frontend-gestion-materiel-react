import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HiOutlineX } from "react-icons/hi";
import type { Projector } from "@/types/projector";
import { useEffect } from "react";
import { BACKEND_URL } from "@/services/api";

interface ProjectorFormModalProps {
  open: boolean;
  onClose: () => void;
  projector: Projector | null;
  onSubmit: (formData: FormData) => void; // ← attend un FormData
  isLoading: boolean;
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  imageFile: File | null;
  setResetForm?: (resetFn: () => void) => void;
}

export const ProjectorFormModal = ({
  open,
  onClose,
  projector,
  onSubmit,
  isLoading,
  imagePreview,
  onImageChange,
  onRemoveImage,
  imageFile,
  setResetForm,
}: ProjectorFormModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (projector) {
      reset({
        ref: projector.ref,
        marque: projector.marque,
        description: projector.description,
        etat: projector.etat,
      });
    } else {
      reset({ ref: "", marque: "", description: "", etat: "disponible" });
    }
  }, [projector, reset]);

  // reset after add
  useEffect(() => {
    if (setResetForm) {
      const resetFn = () =>
        reset({ ref: "", marque: "", description: "", etat: "disponible" });
      setResetForm(() => resetFn);
    }
  }, [reset, setResetForm]);

  // Construction du FormData avant envoi
  const onFormSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("ref", data.ref);
    formData.append("marque", data.marque);
    formData.append("description", data.description || "");
    formData.append("etat", data.etat);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {projector ? "Modifier le projecteur" : "Ajouter un projecteur"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Référence</Label>
            <Input
              {...register("ref", { required: "Référence requise" })}
              className="h-10"
            />
            {errors.ref?.message && (
              <p className="text-red-500 text-sm">
                {errors.ref.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Marque</Label>
            <Input
              {...register("marque", { required: "Marque requise" })}
              className="h-10"
            />
            {errors.marque?.message && (
              <p className="text-red-500 text-sm">
                {errors.marque.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...register("description")} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>État</Label>
            <Controller
              name="etat"
              control={control}
              rules={{ required: "État requis" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full h-10!">
                    <SelectValue placeholder="Choisir un état" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="emprunte">Emprunté</SelectItem>
                    <SelectItem value="en_maintenance">
                      En maintenance
                    </SelectItem>
                    <SelectItem value="hors_service">Hors service</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.etat?.message && (
              <p className="text-red-500 text-sm">
                {errors.etat.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Image</Label>
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className=""
              />
              {imagePreview && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onRemoveImage}
                >
                  <HiOutlineX className="w-4 h-4" />
                </Button>
              )}
            </div>
            {imagePreview && (
              <img
                src={imageFile ? imagePreview : `${BACKEND_URL}${imagePreview}`}
                alt="Aperçu"
                className="mt-2 w-24 h-24 object-cover rounded"
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
