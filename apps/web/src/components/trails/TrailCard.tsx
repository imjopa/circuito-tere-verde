import type { Trail } from "@circuito/db/client";
import { Mountain, Ruler, Timer } from "lucide-react";
import { tv } from "tailwind-variants";

import DifficultyBadge from "@/components/ui/DifficultyBadge";
import StatusBadge from "@/components/ui/StatusBadge";

export interface TrailCardProps {
  trail: Trail;
}

const trailCardHeader = tv({
  base: "relative flex h-24 flex-col justify-end bg-green-700 p-3 px-4 [&>:first-child]:absolute [&>:first-child]:top-2.5 [&>:first-child]:right-3",
  variants: {
    park: {
      "serra-dos-orgaos": "bg-linear-to-br from-green-900 to-green-800",
      "tres-picos": "bg-linear-to-br from-green-800 to-green-700",
      "montanhas-teresopolis": "bg-linear-to-br from-green-700 to-green-600",
    } as Record<string, string>,
  },
  defaultVariants: {
    park: "serra-dos-orgaos",
  },
});

export default function TrailCard({ trail }: TrailCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-gray-100 bg-white transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={trailCardHeader({ park: trail.parkId })}>
        <StatusBadge status={trail.status} />
        <h3 className="font-display text-base text-white">{trail.name}</h3>
      </div>

      <div className="px-4 py-3.5">
        <div className="mb-2.5 flex gap-4">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Ruler className="size-3.5 shrink-0" aria-hidden />
            {(trail.distanceMeters / 1000).toLocaleString("pt-BR", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 1,
            })}{" "}
            km
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Timer className="size-3.5 shrink-0" aria-hidden />
            {trail.duration}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Mountain className="size-3.5 shrink-0" aria-hidden />
            {trail.altitudeMeters.toLocaleString("pt-BR")} m
          </span>
        </div>

        <div className="flex items-center justify-between">
          <DifficultyBadge difficulty={trail.difficulty} />
          <span className="text-xs text-gray-500">{trail.parkName}</span>
        </div>

        {trail.conditions && (
          <p className="mt-2.5 rounded-sm bg-gray-100 px-3 py-2 text-xs leading-relaxed text-gray-500">
            {trail.conditions}
          </p>
        )}
      </div>
    </article>
  );
}
