import type { ParkEvent, Trail } from "@circuito/db/client";
import { useMemo } from "react";

/**
 * useAdminMetrics
 * Deriva todas as métricas do dashboard a partir dos dados informados.
 */
export function useAdminMetrics(trails: Trail[] | undefined, events: ParkEvent[] | undefined) {
  const metrics = useMemo(() => {
    const totalTrails = trails?.length ?? 0;
    const activeTrails =
      trails?.filter((t) => t.status === "open" || t.status === "full").length ?? 0;
    const alertTrails = trails?.filter((t) => t.status === "climate_risk").length ?? 0;
    const closedTrails =
      trails?.filter((t) => t.status === "closed" || t.status === "maintenance").length ?? 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const eventsThisMonth =
      events?.filter((ev) => {
        const evDate = new Date(ev.date);
        return evDate.getMonth() === currentMonth && evDate.getFullYear() === currentYear;
      }).length ?? 0;

    const alertEvents = events?.filter((ev) => ev.status === "few_spots").length ?? 0;

    const activeAlerts = alertTrails + alertEvents;

    const scheduledVisitors =
      events
        ?.filter((ev) => {
          const evDate = new Date(ev.date);
          return evDate.getMonth() === currentMonth && evDate.getFullYear() === currentYear;
        })
        .reduce((sum, ev) => sum + (ev.spots - ev.spotsLeft), 0) ?? 0;

    return {
      totalTrails,
      activeTrails,
      alertTrails,
      closedTrails,
      eventsThisMonth,
      activeAlerts,
      scheduledVisitors,
    };
  }, [trails, events]);

  return metrics;
}
