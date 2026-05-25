import type { Park } from "@circuito/db/client";

import { ParkStatusBadge } from "../parks/ParkStatusBadge";
import { AdminListCard } from "./AdminListCard";

interface AdminParkCardProps {
  park: Park;
  onEdit: (park: Park) => void;
}

export function AdminParkCard({ park, onEdit }: AdminParkCardProps) {
  return (
    <AdminListCard
      badge={<ParkStatusBadge status={park.status} />}
      title={park.name}
      meta={`${park.type} · ${park.areaHectares.toLocaleString("pt-BR")} ha`}
      detail={park.description}
      onEdit={() => onEdit(park)}
    />
  );
}
