// src/pages/dashboard/incident/IncidentFormModal.tsx
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
import type { Incident } from "@/types/incident";
import { useEffect } from "react";

interface IncidentFormModalProps {
  open: boolean;
  onClose: () => void;
  incident: Incident | null;
  onSubmit: (data: { title: string; description?: string }) => void;
  isLoading: boolean;
}

export const IncidentFormModal = ({
  open,
  onClose,
  incident,
  onSubmit,
  isLoading,
}: IncidentFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ title: string; description: string }>();

  useEffect(() => {
    if (incident) {
      reset({
        title: incident.title,
        description: incident.description || "",
      });
    } else {
      reset({ title: "", description: "" });
    }
  }, [incident, reset]);

  const onFormSubmit = (data: { title: string; description: string }) => {
    onSubmit({
      title: data.title,
      description: data.description || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {incident ? "Modifier l'incident" : "Signaler un incident"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input
              {...register("title", { required: "Le titre est requis" })}
              className="h-10"
              placeholder="Titre de l'incident"
            />
            {errors.title?.message && (
              <p className="text-red-500 text-sm">
                {errors.title.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              {...register("description")}
              rows={4}
              placeholder="Décrivez l'incident en détail..."
            />
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