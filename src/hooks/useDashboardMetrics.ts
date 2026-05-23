import { useMemo } from "react";
import { trails } from "../data/trails";
import { parks } from "../data/parks";

// Simula histórico de acessos dos últimos 7 dias
// derivado do número de trilhas abertas como fator multiplicador
function generateWeeklyAccess(openTrailCount: number) {
  const base = openTrailCount * 40;
  const pattern = [0.55, 0.65, 0.58, 0.8, 0.75, 1.0, 0.85];
  return pattern.map((factor) => Math.round(base * factor));
}

export function useDashboardMetrics() {
  return useMemo(() => {
    const totalTrails = trails.length;
    const openTrails = trails.filter((t) => t.status === "open").length;
    const alertTrails = trails.filter((t) => t.status === "climate_risk").length;
    const closedTrails = trails.filter((t) => t.status === "closed").length;
    const activeParks = parks.filter((p) => p.status === "open").length;

    const weeklyAccess = generateWeeklyAccess(openTrails);
    const todayAccess = weeklyAccess[weeklyAccess.length - 1];
    const yesterdayAccess = weeklyAccess[weeklyAccess.length - 2];
    const accessDelta = (todayAccess ?? 0) - (yesterdayAccess ?? 0);
    const accessDeltaLabel =
      accessDelta >= 0 ? `+${accessDelta} vs ontem` : `${accessDelta} vs ontem`;

    const today = new Date();
    const dateLabel = today.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

    return {
      totalTrails,
      openTrails,
      alertTrails,
      closedTrails,
      activeParks,
      todayAccess,
      accessDeltaLabel,
      accessDeltaPositive: accessDelta >= 0,
      weeklyAccess,
      weekDays,
      dateLabel,
    };
  }, []);
}
