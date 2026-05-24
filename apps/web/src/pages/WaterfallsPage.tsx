import { ArrowUp, Droplets, Trees } from "lucide-react";
import { tv } from "tailwind-variants";

import Navbar from "@/components/layout/Navbar";
import { FilterChip } from "@/components/ui/FilterChip";
import { useWaterfallFilters, useWaterfalls } from "@/hooks/data/useWaterfalls";

const accessFilterLabels = {
  easy: "Fácil",
  medium: "Moderado",
  hard: "Difícil",
};

const accessLabel = {
  easy: "Fácil acesso",
  medium: "Acesso moderado",
  hard: "Acesso difícil",
};

const variants = tv({
  slots: {
    base: "overflow-hidden rounded-lg border border-gray-100 bg-white transition hover:-translate-y-0.5 hover:shadow-md",
    header: "relative px-5 pt-5 pb-3",
    accessLabel: "rounded-full px-2.5 py-0.5 text-xs font-medium",
  },
  variants: {
    park: {
      "serra-dos-orgaos": {
        header: "bg-linear-to-br from-green-900 to-green-800",
      },
      "tres-picos": {
        header: "bg-linear-to-br from-green-800 to-green-700",
      },
      "montanhas-teresopolis": {
        header: "bg-linear-to-br from-green-700 to-green-600",
      },
    } as Record<string, { header: string }>,
    access: {
      easy: {
        accessLabel: "bg-green-100 text-green-900",
      },
      medium: {
        accessLabel: "bg-yellow-100 text-yellow-900",
      },
      hard: {
        accessLabel: "bg-red-100 text-red-900",
      },
    },
  },
  defaultVariants: { access: "easy", park: "serra-dos-orgaos" },
});

export default function WaterfallsPage() {
  const { data: waterfalls = [] } = useWaterfalls();
  const [{ access }, setFilters] = useWaterfallFilters();

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="bg-green-700 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl text-white">Cachoeiras</h1>
          <p className="mt-1 text-sm text-white/65">
            {waterfalls.length} cachoeira{waterfalls.length !== 1 ? "s" : ""} encontrada
            {waterfalls.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-7">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="text-sm whitespace-nowrap text-gray-500">Dificuldade de acesso:</span>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={access === ""} onClick={() => setFilters({ access: "" })}>
              Todas
            </FilterChip>
            {Object.entries(accessFilterLabels).map(([value, label]) => (
              <FilterChip
                key={value}
                active={access === value}
                onClick={() => setFilters({ access: value })}
              >
                {label}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {waterfalls.map((wf) => {
            const classes = variants({ access: wf.access, park: wf.parkId });

            return (
              <article key={wf.id} className={classes.base()}>
                <div className={classes.header()}>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    <span className={classes.accessLabel()}>{accessLabel[wf.access]}</span>
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
                      {wf.heightMeters} m
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Trees className="size-3.5 shrink-0" aria-hidden />
                      {wf.parkName}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-gray-600">{wf.description}</p>

                  <div>
                    <p className="mb-0.5 text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Como chegar
                    </p>
                    <p className="text-sm leading-normal text-gray-600">{wf.howToGet}</p>
                  </div>

                  <div>
                    <p className="mb-0.5 text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Acessibilidade
                    </p>
                    <p className="text-sm leading-normal text-gray-600">{wf.accessibility}</p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Dicas
                    </p>
                    <ul className="flex list-none flex-col gap-0.5">
                      {wf.tips.map((tip) => (
                        <li key={tip} className="text-sm text-gray-600">
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
