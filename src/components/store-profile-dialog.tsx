import { z } from "zod";
import { Button } from "./ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getManagerRestaurant } from "@/api/get-managed-restaurant";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile } from "@/api/update-profile";
import { toast } from "sonner";

const storeProfileSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
});

type StoreProfileSchema = z.infer<typeof storeProfileSchema>;

export function StoreProfileDialog() {
  const { data: managedRestaurant } = useQuery({
    queryKey: ["managed-restaurant"],
    queryFn: getManagerRestaurant,
    staleTime: Infinity,

  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<StoreProfileSchema>({
    resolver: zodResolver(storeProfileSchema),
    values: {
      name: managedRestaurant?.name ?? "",
      description: managedRestaurant?.description ?? "",
    },
  });
  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
  });

  async function handleUpdateProfile(data: StoreProfileSchema) {
    try {
      await updateProfileFn({
        name: data.name,
        description: data.description,
      });
      toast.success("Perfil atualizado com sucesso");
    } catch {
      toast.error("Não foi possível atualizar seu perfil, tente novamente.");
    }}

    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Perfil da loja</DialogTitle>
          <DialogDescription>
            Atualize as informações do seu estabelecimento visíveis ao seu
            cliente
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <form onSubmit={handleSubmit(handleUpdateProfile)}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="name">
                  Nome
                </Label>
                <Input className="col-span-3" id="name" {...register("name")} />
              </div>
            </div>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="description">
                  Descrição
                </Label>
                <Textarea
                  className="col-span-3"
                  id="description"
                  {...register("description")}
                />
              </div>
            </div>
            <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
            </DialogClose>
            <Button variant="success" type="submit" disabled={isSubmitting}>
              Salvar
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    );
  }
