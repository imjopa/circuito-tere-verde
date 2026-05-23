import { useMemo } from "react";
import { trails } from "../data/trails";
import { events } from "../data/events";

/**
 * useAdminMetrics
 * Deriva todas as métricas do dashboard a partir do mock data real.
 */
export function useAdminMetrics() {
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

    // Alertas ativos = trilhas com risco climático + eventos com poucas vagas
    const activeAlerts = alertTrails + events.filter((ev) => ev.status === "few_spots").length;

    // Visitantes agendados = soma de (vagas - vagas restantes) nos eventos deste mês
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
  }, []);

  return metrics;
}
