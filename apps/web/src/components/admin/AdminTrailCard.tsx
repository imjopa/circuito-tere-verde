import type { Trail } from "@circuito/db/client";

import StatusBadge from "../ui/StatusBadge";
import { AdminListCard } from "./AdminListCard";

interface AdminTrailCardProps {
  trail: Trail;
  onEdit: (trail: Trail) => void;
  onDelete: (id: string) => void;
}

export function AdminTrailCard({ trail, onEdit, onDelete }: AdminTrailCardProps) {
  const distance = (trail.distanceMeters / 1000).toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  return (
    <AdminListCard
      badge={<StatusBadge status={trail.status} />}
      title={trail.name}
      meta={`${trail.parkName} · ${trail.difficulty} · ${distance} km`}
      detail={trail.conditions}
      onEdit={() => onEdit(trail)}
      onDelete={() => onDelete(trail.id)}
    />
  );
}
