import type { Park, ParkEvent, ParkEventStatus } from "@circuito/db/client";
import { tv } from "tailwind-variants";

import { AdminListCard } from "./AdminListCard";

interface AdminEventCardProps {
  event: ParkEvent & { park: Park };
  onEdit: (event: ParkEvent & { park: Park }) => void;
  onDelete: (id: string) => void;
}

export const DEFAULT_EVENT_STATUS: ParkEventStatus = "open";

export const EVENT_STATUS_OPTIONS = [
  { value: "open", label: "Vagas disponíveis" },
  { value: "few_spots", label: "Últimas vagas" },
  { value: "full", label: "Esgotado" },
  { value: "cancelled", label: "Cancelado" },
] as const;

const eventStatusPillVariants = tv({
  base: "shrink-0 self-start rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
  variants: {
    status: {
      open: "bg-green-100 text-green-900",
      few_spots: "bg-orange-100 text-orange-900",
      full: "bg-red-100 text-red-900",
      cancelled: "bg-gray-100 text-gray-500",
    },
  },
});

export function AdminEventCard({ event, onEdit, onDelete }: AdminEventCardProps) {
  const dateStr = new Date(event.date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const detail = `${event.spotsLeft} vagas restantes de ${event.spots} · ${(event.priceCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;

  return (
    <AdminListCard
      badge={
        <div className={eventStatusPillVariants({ status: event.status })}>
          {EVENT_STATUS_OPTIONS.find((o) => o.value === event.status)?.label ?? event.status}
        </div>
      }
      title={event.title}
      meta={`${event.park.name} · ${dateStr} · ${event.duration}`}
      detail={detail}
      onEdit={() => onEdit(event)}
      onDelete={() => onDelete(event.id)}
      disabled={event.status === "cancelled"}
    />
  );
}
