import Navbar from "@/components/layout/Navbar";
import { FilterChip } from "@/components/ui/FilterChip";
import type { ParkId } from "@/data/parks";
import { waterfalls } from "@/data/waterfalls";
import { ArrowUp, Droplets, Trees } from "lucide-react";
import { useState } from "react";
import { tv } from "tailwind-variants";

const ACCESS_FILTERS = [
  { value: "all", label: "Todas" },
  { value: "easy", label: "Fácil" },
  { value: "medium", label: "Moderado" },
  { value: "hard", label: "Difícil" },
];

const ACCESS_CONFIG = {
  easy: { label: "Fácil acesso", access: "easy" as const },
  medium: { label: "Acesso moderado", access: "moderate" as const },
  hard: { label: "Acesso difícil", access: "difficult" as const },
};

const PARK_HEADER_BG: Record<ParkId, string> = {
  "serra-dos-orgaos": "linear-gradient(135deg, #0a3d2e, #0f5c44)",
  "tres-picos": "linear-gradient(135deg, #0f5c44, #1a6b5a)",
  "montanhas-teresopolis": "linear-gradient(135deg, #1a6b5a, #2a9d7f)",
};

const variants = tv({
  base: "rounded-full px-2.5 py-0.5 text-xs font-medium",
  variants: {
    access: {
      easy: "bg-green-100 text-green-900",
      moderate: "bg-yellow-100 text-yellow-900",
      difficult: "bg-red-100 text-red-900",
    },
  },
  defaultVariants: { access: "easy" },
});

export default function WaterfallsPage() {
  const [activeAccess, setActiveAccess] = useState("all");

  const filtered = waterfalls.filter((wf) => activeAccess === "all" || wf.access === activeAccess);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="bg-green-700 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl text-white">Cachoeiras</h1>
          <p className="mt-1 text-sm text-white/65">
            {filtered.length} cachoeira{filtered.length !== 1 ? "s" : ""} encontrada
            {filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-7">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="whitespace-nowrap text-sm text-gray-500">Dificuldade de acesso:</span>
          <div className="flex flex-wrap gap-2">
            {ACCESS_FILTERS.map((f) => (
              <FilterChip
                key={f.value}
                active={activeAccess === f.value}
                onClick={() => setActiveAccess(f.value)}
              >
                {f.label}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((wf) => {
            const accessCfg = ACCESS_CONFIG[wf.access];
            return (
              <article
                key={wf.id}
                className="overflow-hidden rounded-lg border border-gray-100 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className="relative px-5 pt-5 pb-3"
                  style={{ background: PARK_HEADER_BG[wf.parkId as ParkId] }}
                >
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    <span className={variants({ access: accessCfg.access })}>
                      {accessCfg.label}
                    </span>
                    {wf.allowsBathing && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs text-white">
                        <Droplets className="size-3.5" aria-hidden />
                        Permite banho
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg text-white">{wf.name}</h2>
                  <p className="mt-0.5 text-xs text-white/70">{wf.parkName}</p>
                </div>

                <div className="flex flex-col gap-3.5 px-5 py-4">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <ArrowUp className="size-3.5 shrink-0" aria-hidden />
                      {wf.height}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Trees className="size-3.5 shrink-0" aria-hidden />
                      {wf.parkName.split(" ")[0]}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-gray-600">{wf.description}</p>

                  <div>
                    <p className="mb-0.5 text-xs font-medium uppercase tracking-wider text-gray-500">
                      Como chegar
                    </p>
                    <p className="text-sm leading-normal text-gray-600">{wf.howToGet}</p>
                  </div>

                  <div>
                    <p className="mb-0.5 text-xs font-medium uppercase tracking-wider text-gray-500">
                      Acessibilidade
                    </p>
                    <p className="text-sm leading-normal text-gray-600">{wf.accessibility}</p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">
                      Dicas
                    </p>
                    <ul className="flex list-none flex-col gap-0.5">
                      {wf.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-gray-600">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
