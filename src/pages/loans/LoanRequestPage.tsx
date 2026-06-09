import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  FiPlus,
  FiTrash2,
  FiUser,
  FiMonitor,
  FiHash,
  FiHome,
} from "react-icons/fi";
import { LuProjector } from "react-icons/lu";

import { ComboboxProjector } from "./components/ComboboxProjector";
import { getAccessories } from "../../services/accessory-service";
import { createLoan } from "./actions/loan";
import { HeaderDashboard } from "../components/HeaderDashboard";
import { useUser } from "@/hooks/use-user";
import { ComboboxAccessory } from "./components/ComboboxAccessory";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

// ✅ Correction : Schéma plus explicite
const accessorySchema = z.object({
  accessory_id: z.string().optional(),
  quantity: z.number().min(1, "La quantité doit être au moins 1"),
});

const formSchema = z.object({
  projector_id: z.string().min(1, "Sélectionner un projecteur"),
  loan_date: z.string().min(1, "La date d'emprunt est requise"),
  return_date: z.string().optional(),
  classroom: z.string().optional(),
  room: z.string().optional(),
  cni_number: z.string().min(4, "Numéro CNI invalide"),
  teacher_name: z.string().optional(),
  starting_state: z.string().optional(),
  ending_state: z.string().optional(),
  accessories: z.array(accessorySchema),
});

type FormValues = z.infer<typeof formSchema>;

const LoanRequestPage = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useUser();

  const [accessoriesList, setAccessoriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const date = new Date();
  const queryClient = useQueryClient();

  const dateFormatee = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const heureFormatee = date.toLocaleTimeString("fr-FR");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projector_id: "",
      loan_date: new Date().toISOString().slice(0, 16),
      return_date: "",
      classroom: "",
      room: "",
      cni_number: "",
      teacher_name: "",
      starting_state: "",
      ending_state: "",
      accessories: [{ accessory_id: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "accessories",
  });

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const accResp = await getAccessories({ per_page: 200 });
        const accessories = Array.isArray(accResp)
          ? accResp
          : accResp.data || [];
        setAccessoriesList(accessories);
      } catch (e) {
        console.log(e);
      }
    };
    fetchAccessories();
  }, []);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const payload: any = {
        ...values,
        projector_id: values.projector_id ? Number(values.projector_id) : null,
        user_id: currentUser?.id,
        accessories: values.accessories
          .filter((a) => a.accessory_id)
          .map((a) => ({
            accessory_id: Number(a.accessory_id),
            quantity: Number(a.quantity),
          })),
      };
      await createLoan(payload);

      // ✅ Invalider les requêtes pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ["user-loans"] });
      queryClient.invalidateQueries({ queryKey: ["active-loan"] });

      toast.success("Demande d'emprunt créée avec succès");
      navigate("/dashboard");
    } catch (err: any) {
      console.log("Full error:", err);
      console.log("Error response:", err.response);
      console.log("Error data:", err.response?.data);

      let errorMessage = "Erreur lors de la création de la demande";

      if (err.response?.status === 403) {
        errorMessage =
          err.response?.data?.error ||
          "Vous avez déjà un emprunt en cours. Veuillez le retourner avant d'en faire un nouveau.";
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        errorMessage = Object.values(errors).flat().join(", ");
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderDashboard
        icon={<LuProjector className="w-8 h-8 text-indigo-600" />}
        title="Demande d'emprunt"
        role={currentUser?.role}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">
                Nouvelle demande
              </h2>
              <p className="text-slate-500 mt-1">
                Remplissez les informations pour effectuer une demande
                d'emprunt.
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-10">
                {/* LEFT */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <FiMonitor className="text-indigo-600" />
                    <h3 className="font-semibold text-slate-700">
                      Informations matériel
                    </h3>
                  </div>
                  <Separator />

                  {/* PROJECTOR - COMBOBOX */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Projecteur</label>
                    <Controller
                      control={form.control}
                      name="projector_id"
                      render={({ field }) => (
                        <ComboboxProjector
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Sélectionner un projecteur disponible..."
                        />
                      )}
                    />
                    <p className="text-xs text-gray-500">
                      Seuls les projecteurs disponibles sont affichés.
                    </p>
                    {form.formState.errors.projector_id && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.projector_id.message}
                      </p>
                    )}
                  </div>

                  {/* CLASSROOM + ROOM */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Classe</label>
                      <InputGroup className="h-[45px]! rounded-sm!">
                        <InputGroupAddon>
                          <InputGroupText>
                            <FiHome />
                          </InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                          placeholder="Ex: BTS 2"
                          className="h-[45px]!"
                          {...form.register("classroom")}
                        />
                      </InputGroup>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Salle</label>
                      <InputGroup className="h-[45px]! rounded-sm!">
                        <InputGroupAddon>
                          <InputGroupText>
                            <FiHome />
                          </InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                          placeholder="Ex: Salle 12"
                          className="h-[45px]!"
                          {...form.register("room")}
                        />
                      </InputGroup>
                    </div>
                  </div>

                  {/* CNI */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Numéro CNI</label>
                    <InputGroup className="h-[45px]! rounded-sm!">
                      <InputGroupAddon>
                        <InputGroupText>
                          <FiHash />
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="Entrer votre numéro CNI"
                        className="h-[45px]! rounded-sm py-2! w-full"
                        {...form.register("cni_number")}
                      />
                    </InputGroup>
                    {form.formState.errors.cni_number && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.cni_number.message}
                      </p>
                    )}
                  </div>

                  {/* ACCESSORIES */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-700">
                        Accessoires
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={() =>
                          append({ accessory_id: "", quantity: 1 })
                        }
                      >
                        <FiPlus className="mr-2" /> Ajouter
                      </Button>
                    </div>

                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex gap-3 items-center bg-slate-50 p-4 rounded-sm border"
                      >
                        <div className="flex-1">
                          <Controller
                            control={form.control}
                            name={`accessories.${index}.accessory_id`}
                            render={({ field }) => (
                              <ComboboxAccessory
                                value={field.value || ""}
                                onChange={field.onChange}
                                placeholder="Sélectionner un accessoire..."
                              />
                            )}
                          />
                        </div>
                        <InputGroup className="w-24">
                          <InputGroupInput
                            type="number"
                            min={1}
                            className="h-10"
                            {...form.register(`accessories.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                          />
                        </InputGroup>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="rounded-xl"
                          onClick={() => remove(index)}
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="space-y-6">
                  <div className="flex gap-2">
                    <FiUser className="text-indigo-600" />
                    <h3 className="font-semibold text-slate-700">
                      Informations complémentaires
                    </h3>
                  </div>
                  <Separator />
                  <div className="flex gap-3 ml-auto text-sm text-slate-600">
                    <b>Date d'emprunt: </b>
                    <div>
                      {dateFormatee} à {heureFormatee}
                    </div>
                  </div>
                  <i className="flex gap-3 ml-auto text-sm text-yellow-700">
                    La date de retour sera enregistrée lors du retour du
                    matériel
                  </i>

                  {/* TEACHER */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Nom du professeur
                    </label>
                    <InputGroup className="h-[45px]! rounded-sm!">
                      <InputGroupAddon>
                        <InputGroupText>
                          <FiUser />
                        </InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="Nom complet"
                        className="h-[45px]!"
                        {...form.register("teacher_name")}
                      />
                    </InputGroup>
                  </div>

                  {/* STARTING STATE */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">État initial</label>
                    <Textarea
                      placeholder="Décrire l'état du matériel"
                      className="rounded-sm"
                      {...form.register("starting_state")}
                    />
                  </div>
                  <i className="flex gap-3 ml-auto text-sm text-yellow-700">
                    L'état de retour pourra être entré lors du retour du
                    matériel
                  </i>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-[45px]! px-8 rounded-sm bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {loading ? "Envoi..." : "Envoyer la demande"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LoanRequestPage;
