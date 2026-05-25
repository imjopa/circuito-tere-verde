import type { Park, ParkEvent } from "@circuito/db/client";
import { Clock, Coins, MapPin, Users } from "lucide-react";
import { tv } from "tailwind-variants";

import { EventDateBadge } from "@/components/events/EventDateBadge";
import { categoryLabels, statusLabels } from "@/lib/constants/labels";
import { formatEventPrice } from "@/lib/format";

export interface EventCardProps {
  event: ParkEvent & { park: Park };
  variant?: "full" | "compact";
}

const categoryVariants = tv({
  base: "rounded-full px-2.5 py-0.5 text-xs font-medium",
  variants: {
    category: {
      guided_trail: "bg-[#dcfce7] text-[#14532d]",
      education: "bg-[#dbeafe] text-[#1e3a5f]",
      volunteer: "bg-[#fef9c3] text-[#713f12]",
      workshop: "bg-[#f3e8ff] text-[#4c1d95]",
    },
  },
});

const statusVariants = tv({
  base: "rounded-full px-2.5 py-0.5 text-xs font-medium",
  variants: {
    status: {
      open: "bg-[#dcfce7] text-[#14532d]",
      few_spots: "bg-[#ffedd5] text-[#7c2d12]",
      full: "bg-[#fee2e2] text-[#7f1d1d]",
      cancelled: "bg-[#f1f5f9] text-[#1e293b]",
    },
  },
});

export function EventCard({ event, variant = "full" }: EventCardProps) {
  if (variant === "compact") {
    return (
      <article className="flex items-center gap-4 rounded-md border border-gray-100 bg-white px-5 py-4 transition hover:shadow-sm">
        <EventDateBadge date={event.date} variant="compact" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
          <p className="mt-0.5 text-sm text-gray-500">
            {event.park.name} · {formatEventPrice(event.priceCents)}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs whitespace-nowrap text-green-800">
          {categoryLabels[event.category]}
        </span>
      </article>
    );
  }

  const occupancy = Math.round(((event.spots - event.spotsLeft) / event.spots) * 100);

  return (
    <article className="flex overflow-hidden rounded-lg border border-gray-100 bg-white transition-shadow hover:shadow-md">
      <EventDateBadge date={event.date} variant="sidebar" />

      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-5">
        <div className="flex flex-wrap gap-1.5">
          <span className={categoryVariants({ category: event.category })}>
            {categoryLabels[event.category]}
          </span>
          <span className={statusVariants({ status: event.status })}>
            {statusLabels[event.status]}
          </span>
        </div>

        <h2 className="font-display text-lg font-semibold text-gray-900">{event.title}</h2>
        <p className="flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          {event.park.name}
        </p>
        <p className="text-sm leading-relaxed text-gray-600">{event.description}</p>

        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5 shrink-0" aria-hidden />
            {new Date(event.date).toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}{" "}
            · {event.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <Coins className="size-3.5 shrink-0" aria-hidden />
            {formatEventPrice(event.priceCents)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5 shrink-0" aria-hidden />
            {event.spotsLeft} vagas restantes
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-300"
              // oxlint-disable-next-line react-perf/jsx-no-new-object-as-prop
              style={{ width: `${occupancy}%` }}
            />
          </div>
          <span className="text-xs whitespace-nowrap text-gray-500">{occupancy}% ocupado</span>
        </div>

        {event.requirements?.length > 0 && (
          <div className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Requisitos: </span>
            {event.requirements.join(" · ")}
          </div>
        )}
      </div>
    </article>
  );
}
