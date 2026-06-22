import type { User } from "@/types/user";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}
const roleOptions = [
  { value: "student_delegate", label: "Délégué étudiant" },
  { value: "manager", label: "Gérant" },
  { value: "teacher", label: "Enseignant" },
];

export const classeOptions = [
  { value: "GL 1", label: "GL 1" },
  { value: "GL 2", label: "GL 2" },
  { value: "LIPRO GL 3", label: "LIPRO GL 3" },
  { value: "MASTEUR 1 GL", label: "MASTEUR 1 GL" },
  { value: "MASTEUR 2 GL", label: "MASTEUR 2 GL" },
  { value: "RSI 1", label: "RSI 1" },
  { value: "RSI 2", label: "RSI 2" },
  { value: "LIPRO RSI 3", label: "LIPRO RSI 3" },
  { value: "MASTEUR 1 RSI", label: "MASTEUR 1 RSI" },
  { value: "MASTEUR 2 RSI", label: "MASTEUR 2 RSI" },
  { value: "IWD 1", label: "IWD 1" },
  { value: "IWD 2", label: "IWD 2" },
  { value: "LIPRO IWD 3", label: "LIPRO IWD 3" },
  { value: "MASTEUR 1 IWD", label: "MASTEUR 1 IWD" },
  { value: "MASTEUR 2 IWD", label: "MASTEUR 2 IWD" },

];

export const UserFormModal = ({
  open,
  onClose,
  user,
  onSubmit,
  isLoading,
}: UserFormModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const { data: currentUser } = useUser();

  const selectedRole = useWatch({ control, name: "role" });

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        classe: user.class || "",
        password: "",
        password_confirmation: "",
      });
    } else {
      reset({
        first_name: "",
        last_name: "",
        email: "",
        role: "",
        classe: "",
        password: "",
        password_confirmation: "",
      });
    }
  }, [user, reset]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {user ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="last_name">Nom</Label>
            <Input
              id="last_name"
              {...register("last_name", { required: "Nom requis" })}
              className=" h-10!"
            />
            {errors.last_name?.message && (
              <p className="text-red-500 text-sm">
                {errors.last_name.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="first_name">Prénom</Label>
            <Input
              id="first_name"
              {...register("first_name", { required: "Prénom requis" })}
              className=" h-10!"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm">
                {errors.first_name.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email requis" })}
              className=" h-10!"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Controller
              name="role"
              control={control}
              rules={{ required: "Rôle requis" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full h-10!">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                    {/* { value: "admin", label: "Administrateur" }, */}
                    {currentUser?.class && (
                      <SelectItem value="admin">
                        Administrateur
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-red-500 text-sm">
                {errors.role.message as string}
              </p>
            )}
          </div>

          {/* Classe (visible uniquement pour les étudiants) */}
          {selectedRole === "student_delegate" && (
            <div className="space-y-2">
              <Label htmlFor="classe">Classe</Label>
              <Controller
                name="classe"
                control={control}
                rules={{ required: "Classe requise" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full h-10!">
                      <SelectValue placeholder="Sélectionner une classe" />
                    </SelectTrigger>
                    <SelectContent>
                      {classeOptions.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.classe && (
                <p className="text-red-500 text-sm">
                  {errors.classe.message as string}
                </p>
              )}
            </div>
          )}

          {!user && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password", { required: "Mot de passe requis" })}
                  className=" h-10!"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirmation</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  {...register("password_confirmation", {
                    required: "Confirmation requise",
                    validate: (value, formValues) =>
                      value === formValues.password ||
                      "Les mots de passe ne correspondent pas",
                  })}
                  className=" h-10!"
                />
                {errors.password_confirmation && (
                  <p className="text-red-500 text-sm">
                    {errors.password_confirmation.message as string}
                  </p>
                )}
              </div>
            </>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className=" px-5 h-9"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 px-5 h-9"
            >
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};