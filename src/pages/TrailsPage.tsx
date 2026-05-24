import Navbar from "@/components/layout/Navbar";
import TrailCard from "@/components/trails/TrailCard";
import { Button } from "@/components/ui/Button";
import { FilterChip } from "@/components/ui/FilterChip";
import { useTrailFilters } from "@/hooks/useTrailFilters";
import { Leaf, Search, X } from "lucide-react";

const difficultyFilters = [
  { value: "all", label: "Todas" },
  { value: "easy", label: "Fácil" },
  { value: "medium", label: "Moderado" },
  { value: "hard", label: "Difícil" },
];

const parkFilters = [
  { value: "all", label: "Todos os parques" },
  { value: "serra-dos-orgaos", label: "Serra dos Órgãos" },
  { value: "tres-picos", label: "Três Picos" },
  { value: "montanhas-teresopolis", label: "Montanhas de Teresópolis" },
];

export default function TrailsPage() {
  const {
    searchQuery,
    setSearchQuery,
    activeDifficulty,
    setActiveDifficulty,
    activePark,
    setActivePark,
    filteredTrails,
  } = useTrailFilters();

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="bg-green-700 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl text-white">Trilhas</h1>
          <p className="mt-1 text-sm text-white/65">
            {filteredTrails.length} trilha{filteredTrails.length !== 1 ? "s" : ""} encontrada
            {filteredTrails.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-7">
        <div className="mb-5 flex items-center gap-3 rounded-full border border-gray-100 bg-white px-4 py-2.5 shadow-sm">
          <Search className="size-5 shrink-0 text-gray-400" aria-hidden />
          <input
            type="text"
            placeholder="Buscar trilha ou parque..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none bg-transparent font-body text-sm outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="flex size-5 items-center justify-center rounded-full bg-gray-100 text-gray-500"
              aria-label="Limpar busca"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          )}
        </div>

        <div className="mb-3.5 flex flex-wrap items-center gap-3">
          <span className="whitespace-nowrap text-sm text-gray-500">Dificuldade:</span>
          <div className="flex flex-wrap gap-2">
            {difficultyFilters.map((filter) => (
              <FilterChip
                key={filter.value}
                active={activeDifficulty === filter.value}
                onClick={() => setActiveDifficulty(filter.value)}
              >
                {filter.label}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="mb-3.5 flex flex-wrap items-center gap-3">
          <span className="whitespace-nowrap text-sm text-gray-500">Parque:</span>
          <div className="flex flex-wrap gap-2">
            {parkFilters.map((filter) => (
              <FilterChip
                key={filter.value}
                active={activePark === filter.value}
                onClick={() => setActivePark(filter.value)}
              >
                {filter.label}
              </FilterChip>
            ))}
          </div>
        </div>

        {filteredTrails.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTrails.map((trail) => (
              <TrailCard key={trail.id} trail={trail} />
            ))}
          </div>
        ) : (
          <div className="px-4 py-16 text-center text-gray-500">
            <Leaf className="mx-auto mb-4 size-12 text-green-600" aria-hidden />
            <p className="mb-5 text-sm">Nenhuma trilha encontrada com esses filtros.</p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setActiveDifficulty("all");
                setActivePark("all");
              }}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
