import { useState, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useProjectors } from "@/hooks/use-projector";
import debounce from "lodash.debounce";

interface ComboboxProjectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ComboboxProjector = ({ 
  value, 
  onChange, 
  placeholder = "Sélectionner un projecteur..." 
}: ComboboxProjectorProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Hook qui recherche directement en BD avec le terme de recherche
  const { projectors, isLoading, refetch } = useProjectors({ 
    page: 1, 
    per_page: 20, 
    search: search || undefined,
  });

  // Debounce sur la recherche
  const debouncedSetSearch = useCallback(
    debounce((value: string) => setSearch(value), 500),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  // Filtrer uniquement les projecteurs disponibles
  const availableProjectors = projectors?.filter(p => p.etat === "disponible") || [];

  const selectedProjector = availableProjectors.find(p => String(p.id) === value);

  // Recharger quand le search change
  useEffect(() => {
    refetch();
  }, [search, refetch]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10"
        >
          {isLoading ? "Chargement..." : (selectedProjector ? selectedProjector.marque : placeholder)}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Rechercher un projecteur..." 
            onValueChange={debouncedSetSearch}
          />
          <CommandList>
            {isLoading && (
              <div className="py-6 text-center text-sm text-gray-500">
                Recherche en cours...
              </div>
            )}
            {!isLoading && availableProjectors.length === 0 && (
              <CommandEmpty>Aucun projecteur disponible.</CommandEmpty>
            )}
            {!isLoading && availableProjectors.length > 0 && (
              <CommandGroup>
                {availableProjectors.map((projector) => (
                  <CommandItem
                    key={projector.id}
                    value={`${projector.marque} ${projector.ref || ""}`}
                    onSelect={() => {
                      onChange(String(projector.id));
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === String(projector.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{projector.marque}</span>
                      {projector.ref && (
                        <span className="text-xs text-gray-500">Réf: {projector.ref}</span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};