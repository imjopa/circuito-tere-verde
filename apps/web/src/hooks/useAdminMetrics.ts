import { useMemo } from "react";

import type { ParkEvent, Trail } from "@/types";

/**
 * useAdminMetrics
 * Deriva todas as métricas do dashboard a partir dos dados informados.
 */
export function useAdminMetrics(trails: Trail[], events: ParkEvent[]) {
  const metrics = useMemo(() => {
    const totalTrails = trails.length;
    const activeTrails = trails.filter((t) => t.status === "open" || t.status === "full").length;
    const alertTrails = trails.filter((t) => t.status === "climate_risk").length;
    const closedTrails = trails.filter(
      (t) => t.status === "closed" || t.status === "maintenance",
    ).length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const eventsThisMonth = events.filter((ev) => {
      const evDate = new Date(ev.date);
      return evDate.getMonth() === currentMonth && evDate.getFullYear() === currentYear;
    }).length;

    const activeAlerts = alertTrails + events.filter((ev) => ev.status === "few_spots").length;

    const scheduledVisitors = events
      .filter((ev) => {
        const evDate = new Date(ev.date);
        return evDate.getMonth() === currentMonth && evDate.getFullYear() === currentYear;
      })
      .reduce((sum, ev) => sum + (ev.spots - ev.spotsLeft), 0);

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
