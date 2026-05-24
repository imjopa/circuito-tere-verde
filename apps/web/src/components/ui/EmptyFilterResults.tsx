import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/Button";

export interface EmptyFilterResultsProps {
  icon: LucideIcon;
  message: string;
  onClearFilters: () => void;
}

export function EmptyFilterResults({
  icon: Icon,
  message,
  onClearFilters,
}: EmptyFilterResultsProps) {
  return (
    <div className="px-4 py-16 text-center text-gray-500">
      <Icon className="mx-auto mb-4 size-12 text-green-600" aria-hidden />
      <p className="mb-5 text-sm">{message}</p>
      <Button onClick={onClearFilters}>Limpar filtros</Button>
    </div>
  );
}
