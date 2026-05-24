import { Mountain, Ruler, Timer } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import DifficultyBadge from "../ui/DifficultyBadge";
import type { Trail } from "../../data/trails";

export interface TrailCardProps {
  trail: Trail;
}

export default function TrailCard({ trail }: TrailCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-gray-100 bg-white transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        className="relative flex h-[100px] flex-col justify-end bg-green-700 p-3 px-4 data-[park=serra-dos-orgaos]:bg-linear-to-br data-[park=serra-dos-orgaos]:from-green-900 data-[park=serra-dos-orgaos]:to-green-800 data-[park=tres-picos]:bg-linear-to-br data-[park=tres-picos]:from-green-800 data-[park=tres-picos]:to-green-700 data-[park=montanhas-teresopolis]:bg-linear-to-br data-[park=montanhas-teresopolis]:from-green-700 data-[park=montanhas-teresopolis]:to-green-600 [&>:first-child]:absolute [&>:first-child]:top-2.5 [&>:first-child]:right-3"
        data-park={trail.parkId}
      >
        <StatusBadge status={trail.status} />
        <h3 className="font-display text-base text-white">{trail.name}</h3>
      </div>

      <div className="px-4 py-3.5">
        <div className="mb-2.5 flex gap-4">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Ruler className="size-3.5 shrink-0" aria-hidden />
            {trail.distance} km
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Timer className="size-3.5 shrink-0" aria-hidden />
            {trail.duration}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Mountain className="size-3.5 shrink-0" aria-hidden />
            {trail.altitude} m
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
