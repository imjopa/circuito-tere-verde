import type { Waterfall } from "@circuito/db/client";

import { waterfallAccessLabels } from "@/lib/constants/labels";

import { AdminListCard } from "./AdminListCard";

interface AdminWaterfallCardProps {
  waterfall: Waterfall;
  onEdit: (waterfall: Waterfall) => void;
  onDelete: (id: string) => void;
}

export function AdminWaterfallCard({ waterfall, onEdit, onDelete }: AdminWaterfallCardProps) {
  return (
    <AdminListCard
      badge={
        <span className="shrink-0 self-start rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-900">
          {waterfallAccessLabels[waterfall.access]}
        </span>
      }
      title={waterfall.name}
      meta={`${waterfall.parkName} · ${waterfall.heightMeters} m · ${
        waterfall.allowsBathing ? "Permite banho" : "Sem banho"
      }`}
      detail={waterfall.description}
      onEdit={() => onEdit(waterfall)}
      onDelete={() => onDelete(waterfall.id)}
    />
  );
}
