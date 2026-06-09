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
import { useAccessories } from "@/hooks/use-accessory";
import debounce from "lodash.debounce";

interface ComboboxAccessoryProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ComboboxAccessory = ({ 
  value, 
  onChange, 
  placeholder = "Sélectionner un accessoire..." 
}: ComboboxAccessoryProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { accessories, isLoading, refetch } = useAccessories({ 
    page: 1, 
    per_page: 20, 
    search: search || undefined,
  });

  const debouncedSetSearch = useCallback(
    debounce((value: string) => setSearch(value), 500),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  useEffect(() => {
    refetch();
  }, [search, refetch]);

  const selectedAccessory = accessories?.find(a => String(a.id) === value);

  const getDisplayLabel = (accessory: any) => {
    if (accessory.name) return accessory.name;
    return `#${accessory.id}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10"
        >
          {isLoading ? "Chargement..." : (selectedAccessory ? getDisplayLabel(selectedAccessory) : placeholder)}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0" 
        align="start" 
        sideOffset={5}
        style={{ width: "var(--radix-popover-trigger-width)", maxWidth: "100%" }}
      >
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="Rechercher un accessoire..." 
            onValueChange={debouncedSetSearch}
          />
          <CommandList className="max-h-[300px] overflow-y-auto">
            {isLoading && (
              <div className="py-6 text-center text-sm text-gray-500">
                Recherche en cours...
              </div>
            )}
            {!isLoading && (!accessories || accessories.length === 0) && (
              <CommandEmpty>Aucun accessoire trouvé.</CommandEmpty>
            )}
            {!isLoading && accessories && accessories.length > 0 && (
              <CommandGroup>
                {accessories.map((accessory) => (
                  <CommandItem
                    key={accessory.id}
                    value={String(accessory.id)}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === String(accessory.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{getDisplayLabel(accessory)}</span>
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