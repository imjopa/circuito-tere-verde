import type { ParkEventStatus } from "../../data/events";
import type { TrailStatus } from "../../data/trails";
import { statusBadge } from "../../lib/variants/badge";

type StatusVariant =
  | "open"
  | "closed"
  | "maintenance"
  | "climate_risk"
  | "full"
  | "cancelled"
  | "few_spots";

const STATUS_CONFIG: Record<
  TrailStatus | ParkEventStatus,
  { label: string; status: StatusVariant }
> = {
  open: { label: "Aberta", status: "open" },
  closed: { label: "Fechada", status: "closed" },
  maintenance: { label: "Manutenção", status: "maintenance" },
  climate_risk: { label: "Risco Climático", status: "climate_risk" },
  full: { label: "Lotada", status: "full" },
  cancelled: { label: "Cancelada", status: "cancelled" },
  few_spots: { label: "Poucas Vagas", status: "few_spots" },
};

export interface StatusBadgeProps {
  status: TrailStatus | ParkEventStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.open;

  return <span className={statusBadge({ status: config.status })}>{config.label}</span>;
}
