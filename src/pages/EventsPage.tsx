import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import { events, type ParkEventStatus } from "../data/events";
import { filterChip } from "../lib/variants/chip";

type EventCategory = "guided_trail" | "education" | "volunteer" | "workshop";

const CATEGORY_FILTERS: { value: EventCategory | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "guided_trail", label: "Trilha Guiada" },
  { value: "education", label: "Educativo" },
  { value: "volunteer", label: "Voluntário" },
  { value: "workshop", label: "Workshop" },
];

const CATEGORY_COLORS: Record<EventCategory, { bg: string; color: string }> = {
  guided_trail: { bg: "#dcfce7", color: "#14532d" },
  education: { bg: "#dbeafe", color: "#1e3a5f" },
  volunteer: { bg: "#fef9c3", color: "#713f12" },
  workshop: { bg: "#f3e8ff", color: "#4c1d95" },
};

const STATUS_CONFIG: Record<ParkEventStatus, { label: string; bg: string; color: string }> = {
  open: { label: "Vagas disponíveis", bg: "#dcfce7", color: "#14532d" },
  few_spots: { label: "Últimas vagas", bg: "#ffedd5", color: "#7c2d12" },
  full: { label: "Esgotado", bg: "#fee2e2", color: "#7f1d1d" },
  cancelled: { label: "Cancelado", bg: "#f1f5f9", color: "#1e293b" },
};

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState<EventCategory | "all">("all");

  const filtered = events
    .filter((ev) => activeCategory === "all" || ev.category === activeCategory)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="bg-green-700 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-[1.75rem] text-white">Eventos</h1>
          <p className="mt-1 text-sm text-white/65">
            Atividades, trilhas guiadas e programas educativos nos parques
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-7">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="whitespace-nowrap text-[0.8125rem] text-gray-500">Categoria:</span>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((f) => (
              <button
                key={f.value}
                className={filterChip({ active: activeCategory === f.value })}
                onClick={() => setActiveCategory(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="px-4 py-12 text-center text-[0.9375rem] text-gray-500">
            Nenhum evento nessa categoria no momento.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((ev) => {
              const evDate = new Date(ev.date + "T00:00:00");
              const day = evDate.getDate().toString().padStart(2, "0");
              const month = evDate
                .toLocaleDateString("pt-BR", { month: "short" })
                .replace(".", "")
                .toUpperCase();
              const weekday = evDate.toLocaleDateString("pt-BR", { weekday: "long" });
              const catColor = CATEGORY_COLORS[ev.category];
              const statusCfg = STATUS_CONFIG[ev.status] ?? STATUS_CONFIG.open;
              const occupancy = Math.round(((ev.spots - ev.spotsLeft) / ev.spots) * 100);

              return (
                <article
                  key={ev.id}
                  className="flex overflow-hidden rounded-lg border border-gray-100 bg-white transition-shadow hover:shadow-md"
                >
                  <div className="flex min-w-[72px] shrink-0 flex-col items-center justify-center gap-0.5 bg-green-700 px-4 py-5 text-white">
                    <span className="font-display text-[1.75rem] leading-none font-bold">
                      {day}
                    </span>
                    <span className="text-[0.6875rem] uppercase tracking-wider opacity-85">
                      {month}
                    </span>
                    <span className="mt-0.5 text-center text-[0.5625rem] opacity-65">
                      {weekday}
                    </span>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-5">
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[0.6875rem] font-medium"
                        style={{ background: catColor.bg, color: catColor.color }}
                      >
                        {ev.categoryLabel}
                      </span>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[0.6875rem] font-medium"
                        style={{ background: statusCfg.bg, color: statusCfg.color }}
                      >
                        {statusCfg.label}
                      </span>
                    </div>

                    <h2 className="font-display text-[1.0625rem] font-semibold text-gray-900">
                      {ev.title}
                    </h2>
                    <p className="text-[0.8125rem] text-gray-500">📍 {ev.park}</p>
                    <p className="text-sm leading-relaxed text-gray-600">{ev.description}</p>

                    <div className="flex flex-wrap gap-3 text-[0.8125rem] text-gray-500">
                      <span>
                        🕐 {ev.time} · {ev.duration}
                      </span>
                      <span>💰 {ev.price}</span>
                      <span>👥 {ev.spotsLeft} vagas restantes</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-green-500 transition-[width] duration-300"
                          style={{ width: `${occupancy}%` }}
                        />
                      </div>
                      <span className="whitespace-nowrap text-xs text-gray-500">
                        {occupancy}% ocupado
                      </span>
                    </div>

                    {ev.requirements?.length > 0 && (
                      <div className="text-[0.8125rem] text-gray-500">
                        <span className="font-medium text-gray-700">Requisitos: </span>
                        {ev.requirements.join(" · ")}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
