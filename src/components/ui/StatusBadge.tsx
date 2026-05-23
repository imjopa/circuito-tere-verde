import type { ParkEventStatus } from "../../data/events";
import type { TrailStatus } from "../../data/trails";
import styles from "./StatusBadge.module.css";

const STATUS_CONFIG: Record<TrailStatus | ParkEventStatus, { label: string; className: string }> = {
  open: { label: "Aberta", className: "open" },
  closed: { label: "Fechada", className: "closed" },
  maintenance: { label: "Manutenção", className: "maintenance" },
  climate_risk: { label: "Risco Climático", className: "climateRisk" },
  full: { label: "Lotada", className: "full" },
  cancelled: { label: "Cancelada", className: "cancelled" },
  few_spots: { label: "Poucas Vagas", className: "fewSpots" },
};

export interface StatusBadgeProps {
  status: TrailStatus | ParkEventStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.open;

  return <span className={`${styles.badge} ${styles[config.className]}`}>{config.label}</span>;
}
