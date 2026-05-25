import { Leaf } from "lucide-react";
import { useCallback, useMemo } from "react";

import { PageLayout } from "@/components/layout/PageLayout";
import TrailCard from "@/components/trails/TrailCard";
import { EmptyFilterResults } from "@/components/ui/EmptyFilterResults";
import { FilterGroup } from "@/components/ui/FilterGroup";
import { LoadingMessage, QueryErrorState } from "@/components/ui/QueryFeedback";
import { SearchBar } from "@/components/ui/SearchBar";
import { useParks } from "@/hooks/data/useParks";
import { useTrailFilters, useTrails } from "@/hooks/data/useTrails";
import { difficultyLabels } from "@/lib/constants/labels";
import { formatCountLabel } from "@/lib/format";

const difficultyOptions = Object.entries(difficultyLabels).map(([value, label]) => ({
  value,
  label,
}));

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

  const parkOptions = useMemo(
    () => parks.data?.map((p) => ({ value: p.id, label: p.name })) ?? [],
    [parks.data],
  );

  const trailCount = trails.data?.length ?? 0;

  return (
    <PageLayout
      title="Trilhas"
      subtitle={formatCountLabel(trailCount, "trilha encontrada", "trilhas encontradas")}
    >
      <SearchBar
        value={q}
        onChange={handleSearch}
        onClear={handleClearSearch}
        placeholder="Buscar trilha ou parque..."
        ariaLabel="Buscar trilha ou parque..."
        className="mb-5"
      />

      <FilterGroup
        label="Dificuldade"
        options={difficultyOptions}
        value={difficulty}
        onChange={(value) => setFilters({ difficulty: value })}
        className="mb-3.5 flex flex-wrap items-center gap-3"
      />

      <FilterGroup
        label="Parque"
        options={parkOptions}
        value={park}
        onChange={(value) => setFilters({ park: value })}
        allLabel="Todos"
        className="mb-3.5 flex flex-wrap items-center gap-3"
      />

      {trails.isLoading ? (
        <LoadingMessage>Carregando trilhas...</LoadingMessage>
      ) : trails.error ? (
        <QueryErrorState onRetry={() => trails.refetch()}>
          Erro ao carregar trilhas.
        </QueryErrorState>
      ) : !trails.data?.length ? (
        <EmptyFilterResults
          icon={Leaf}
          message="Nenhuma trilha encontrada com esses filtros."
          onClearFilters={handleClearFilters}
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trails.data.map((trail) => (
            <TrailCard key={trail.id} trail={trail} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
