import { Clock, Coins, MapPin, Users } from "lucide-react";
import { useCallback, useState } from "react";
import { tv } from "tailwind-variants";

import Navbar from "@/components/layout/Navbar";
import { FilterChip } from "@/components/ui/FilterChip";
import { events } from "@/data/events";

type EventCategory = "guided_trail" | "education" | "volunteer" | "workshop";

const categoryLabels = {
  all: "Todos",
  guided_trail: "Trilha Guiada",
  education: "Educativo",
  volunteer: "Voluntário",
  workshop: "Workshop",
};

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

const statusLabels = {
  open: "Vagas disponíveis",
  few_spots: "Últimas vagas",
  full: "Esgotado",
  cancelled: "Cancelado",
};

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

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState<EventCategory | "all">("all");

  const filtered = events
    .filter((ev) => activeCategory === "all" || ev.category === activeCategory)
    .toSorted((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="bg-green-700 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl text-white">Eventos</h1>
          <p className="mt-1 text-sm text-white/65">
            Atividades, trilhas guiadas e programas educativos nos parques
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-7">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="text-sm whitespace-nowrap text-gray-500">Categoria:</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryLabels).map(([value, label]) => {
              const handleClick = useCallback(() => {
                setActiveCategory(value as EventCategory);
              }, [value]);

              return (
                <FilterChip key={value} active={activeCategory === value} onClick={handleClick}>
                  {label}
                </FilterChip>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-gray-500">
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
              const occupancy = Math.round(((ev.spots - ev.spotsLeft) / ev.spots) * 100);

              return (
                <article
                  key={ev.id}
                  className="flex overflow-hidden rounded-lg border border-gray-100 bg-white transition-shadow hover:shadow-md"
                >
                  <div className="flex w-20 shrink-0 flex-col items-center justify-center gap-0.5 bg-green-700 px-4 py-5 text-white">
                    <span className="font-display text-3xl leading-none font-bold">{day}</span>
                    <span className="text-xs tracking-wider uppercase opacity-85">{month}</span>
                    <span className="mt-0.5 text-center text-xs opacity-65">{weekday}</span>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-5">
                    <div className="flex flex-wrap gap-1.5">
                      <span className={categoryVariants({ category: ev.category })}>
                        {ev.categoryLabel}
                      </span>
                      <span className={statusVariants({ status: ev.status })}>
                        {statusLabels[ev.status]}
                      </span>
                    </div>

                    <h2 className="font-display text-lg font-semibold text-gray-900">{ev.title}</h2>
                    <p className="flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin className="size-3.5 shrink-0" aria-hidden />
                      {ev.park}
                    </p>
                    <p className="text-sm leading-relaxed text-gray-600">{ev.description}</p>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5 shrink-0" aria-hidden />
                        {ev.time} · {ev.duration}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Coins className="size-3.5 shrink-0" aria-hidden />
                        {ev.price}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="size-3.5 shrink-0" aria-hidden />
                        {ev.spotsLeft} vagas restantes
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-green-500 transition-all duration-300"
                          // width has to be dynamic
                          // oxlint-disable-next-line react-perf/jsx-no-new-object-as-prop
                          style={{ width: `${occupancy}%` }}
                        />
                      </div>
                      <span className="text-xs whitespace-nowrap text-gray-500">
                        {occupancy}% ocupado
                      </span>
                    </div>

                    {ev.requirements?.length > 0 && (
                      <div className="text-sm text-gray-500">
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
