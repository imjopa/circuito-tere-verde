import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";

import { Link } from "@/components/ui/Link";
import StatusBadge from "@/components/ui/StatusBadge";
import { useEvents } from "@/hooks/data/useEvents";
import { useTrails } from "@/hooks/data/useTrails";
import { useAdminMetrics } from "@/hooks/useAdminMetrics";

export default function AdminDashboardPage() {
  const trails = useTrails();
  const events = useEvents();
  const metrics = useAdminMetrics(trails.data, events.data);

  const upcomingEvents = useMemo(() => {
    return (
      events.data
        ?.filter((ev) => new Date(ev.date) >= new Date())
        .toSorted((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3) ?? []
    );
  }, [events.data]);

  return (
    <>
      <section
        aria-label="Resumo de métricas"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        {(
          [
            {
              alert: false,
              label: "Visitantes agendados (mês)",
              value: metrics.scheduledVisitors,
              delta: `via ${metrics.eventsThisMonth} evento${metrics.eventsThisMonth !== 1 ? "s" : ""}`,
            },
            {
              alert: false,
              label: "Trilhas abertas",
              value:
                trails.data?.filter((t) => t.status === "open" || t.status === "full").length ?? 0,
              delta: `de ${trails.data?.length ?? 0} cadastradas`,
            },
            {
              alert: false,
              label: "Eventos este mês",
              value: metrics.eventsThisMonth,
              delta: metrics.eventsThisMonth > 0 ? "Ativos no calendário" : "Nenhum agendado",
            },
            {
              alert: metrics.activeAlerts > 0,
              label: "Alertas ativos",
              value: metrics.activeAlerts,
              delta: metrics.activeAlerts === 0 ? "Tudo normal" : "Requer atenção",
            },
          ] as const
        ).map((metric) => (
          <div
            key={metric.label}
            className={`rounded-lg border px-5 py-4 ${
              metric.alert ? "border-red-300 bg-red-50" : "border-gray-100 bg-white"
            }`}
          >
            <p className="mb-1.5 text-xs leading-snug text-gray-500">{metric.label}</p>
            <p
              className={`font-display text-3xl leading-none font-semibold ${
                metric.alert ? "text-red-700" : "text-green-800"
              }`}
            >
              {metric.value}
            </p>
            <span
              className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-xs ${
                metric.alert ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
              }`}
            >
              {metric.delta}
            </span>
          </div>
        ))}
      </section>

      <section
        className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2"
        aria-label="Detalhes operacionais"
      >
        <div className="rounded-lg border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-green-800">Status das trilhas</h2>
            <Link to="/admin/trilhas" variant="transparent" className="flex items-center gap-1">
              Gerenciar <ArrowRight className="size-4" />
            </Link>
          </div>
          <ul className="flex list-none flex-col">
            {trails.data?.slice(0, 5).map((trail) => (
              <li
                key={trail.id}
                className="flex items-center gap-2.5 border-b border-gray-100 py-2 last:border-b-0"
              >
                <StatusBadge status={trail.status} />
                <span className="min-w-0 flex-1 truncate text-sm text-gray-700">{trail.name}</span>
                <span className="text-xs whitespace-nowrap text-gray-500">
                  {trail.parkName.split(" ")[0]}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-gray-100 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-green-800">Próximos eventos</h2>
              <RouterLink
                to="/admin/eventos"
                className="flex items-center gap-1 text-sm font-medium text-green-600 transition hover:text-green-800"
              >
                Gerenciar <ArrowRight className="size-4" />
              </RouterLink>
            </div>
            <ul className="flex list-none flex-col">
              {upcomingEvents.map((ev) => {
                const evDate = new Date(ev.date + "T00:00:00");
                const day = evDate.getDate().toString().padStart(2, "0");
                const month = evDate
                  .toLocaleDateString("pt-BR", { month: "short" })
                  .replace(".", "")
                  .toUpperCase();
                return (
                  <li
                    key={ev.id}
                    className="flex items-center gap-3 border-b border-gray-100 py-2 last:border-b-0"
                  >
                    <div className="min-w-10 shrink-0 rounded-md bg-green-700 px-2.5 py-1.5 text-center text-white">
                      <span className="block text-base leading-tight font-semibold">{day}</span>
                      <span className="text-xs tracking-wide uppercase opacity-80">{month}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-800">{ev.title}</p>
                      <p className="mt-px text-xs text-gray-500">
                        {ev.park.name} · {ev.spotsLeft} vagas
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col items-center gap-2.5 rounded-lg border border-gray-100 bg-white p-5">
            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
              Projeto acadêmico
            </p>
            <img
              src="/unifeso-logo.png"
              alt="Logotipo da UNIFESO"
              className="w-full max-w-40 object-contain opacity-90"
            />
            <p className="text-center text-xs text-gray-500">
              Desenvolvimento de MVP Front-End · 2025
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
