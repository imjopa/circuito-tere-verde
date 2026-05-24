import { Leaf, Search, X } from "lucide-react";
import { useCallback } from "react";

import Navbar from "@/components/layout/Navbar";
import TrailCard from "@/components/trails/TrailCard";
import { Button } from "@/components/ui/Button";
import { FilterChip } from "@/components/ui/FilterChip";
import { useParks } from "@/hooks/data/useParks";
import { useTrailFilters, useTrails } from "@/hooks/data/useTrails";

const difficultyLabels = {
  easy: "Fácil",
  medium: "Moderado",
  hard: "Difícil",
} as const;

export default function TrailsPage() {
  const parks = useParks();
  const trails = useTrails();

  const [{ q, difficulty, park }, setFilters] = useTrailFilters();

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setFilters({ q: e.target.value }),
    [setFilters],
  );

  const handleClearSearch = useCallback(() => setFilters({ q: "" }), [setFilters]);

  const handleClearFilters = useCallback(
    () => setFilters({ q: "", difficulty: "", park: "" }),
    [setFilters],
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="bg-green-700 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl text-white">Trilhas</h1>
          <p className="mt-1 text-sm text-white/65">
            {trails.data?.length ?? 0} trilha{trails.data?.length !== 1 ? "s" : ""} encontrada
            {trails.data?.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-7">
        <div className="mb-5 flex items-center gap-3 rounded-full border border-gray-100 bg-white px-4 py-2.5 shadow-sm">
          <Search className="size-5 shrink-0 text-gray-400" aria-hidden />
          <input
            type="text"
            aria-label="Buscar trilha ou parque..."
            placeholder="Buscar trilha ou parque..."
            value={q}
            onChange={handleSearch}
            className="font-body flex-1 border-none bg-transparent text-sm outline-none"
          />
          {q && (
            <button
              onClick={handleClearSearch}
              className="flex size-5 items-center justify-center rounded-full bg-gray-100 text-gray-500"
              aria-label="Limpar busca"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          )}
        </div>

        <div className="mb-3.5 flex flex-wrap items-center gap-3">
          <span className="text-sm whitespace-nowrap text-gray-500">Dificuldade:</span>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={difficulty === ""} onClick={() => setFilters({ difficulty: "" })}>
              Todas
            </FilterChip>
            {Object.entries(difficultyLabels).map(([value, label]) => (
              <FilterChip
                key={value}
                active={difficulty === value}
                // oxlint-disable-next-line react-perf/jsx-no-new-function-as-prop
                onClick={() => setFilters({ difficulty: value })}
              >
                {label}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="mb-3.5 flex flex-wrap items-center gap-3">
          <span className="text-sm whitespace-nowrap text-gray-500">Parque:</span>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={park === ""} onClick={() => setFilters({ park: "" })}>
              Todos
            </FilterChip>
            {parks.data?.map((filter) => (
              <FilterChip
                key={filter.id}
                active={park === filter.id}
                // oxlint-disable-next-line react-perf/jsx-no-new-function-as-prop
                onClick={() => setFilters({ park: filter.id })}
              >
                {filter.name}
              </FilterChip>
            ))}
          </div>
        </div>

        {trails.isLoading ? (
          <p className="px-4 py-16 text-center text-sm text-gray-500">Carregando trilhas...</p>
        ) : trails.data?.length && trails.data.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trails.data.map((trail) => (
              <TrailCard key={trail.id} trail={trail} />
            ))}
          </div>
        ) : (
          <div className="px-4 py-16 text-center text-gray-500">
            <Leaf className="mx-auto mb-4 size-12 text-green-600" aria-hidden />
            <p className="mb-5 text-sm">Nenhuma trilha encontrada com esses filtros.</p>
            <Button onClick={handleClearFilters}>Limpar filtros</Button>
          </div>
        )}
      </main>
    </div>
  );
}
