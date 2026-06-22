import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HiOutlineX } from "react-icons/hi";
import type { Accessory } from "@/types/accessory";
import { useEffect } from "react";
import { BACKEND_URL } from "@/services/api";

interface AccessoryFormModalProps {
  open: boolean;
  onClose: () => void;
  accessory: Accessory | null;
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  imageFile: File | null;
  setResetForm?: (resetFn: () => void) => void;
}

export const AccessoryFormModal = ({
  open,
  onClose,
  accessory,
  onSubmit,
  isLoading,
  imagePreview,
  onImageChange,
  onRemoveImage,
  imageFile,
  setResetForm,
}: AccessoryFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (accessory) {
      reset({
        name: accessory.name,
        quantity: accessory.quantity,
        description: accessory.description,
      });
    } else {
      reset({ name: "", quantity: 1, description: "" });
    }
  }, [accessory, reset]);

  // reset after add
  useEffect(() => {
    if (setResetForm) {
      const resetFn = () =>
        reset({ name: "", quantity: 1, description: "" });
      setResetForm(() => resetFn);
    }
  }, [reset, setResetForm]);

  // Construction du FormData avant envoi
  const onFormSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("quantity", data.quantity);
    formData.append("description", data.description || "");
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
            {accessory ? "Modifier l'accessoire" : "Ajouter un accessoire"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Nom</Label>
            <Input
              {...register("name", { required: "Nom requis" })}
              className="h-10"
            />
            {errors.name?.message && (
              <p className="text-red-500 text-sm">
                {errors.name.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Quantité</Label>
            <Input
              type="number"
              min="0"
              {...register("quantity", { required: "Quantité requise", valueAsNumber: true })}
              className="h-10"
            />
            {errors.quantity?.message && (
              <p className="text-red-500 text-sm">
                {errors.quantity.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...register("description")} rows={3} />
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
