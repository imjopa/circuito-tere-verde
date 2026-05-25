import { Droplets } from "lucide-react";
import { useCallback, useMemo } from "react";

import { PageLayout } from "@/components/layout/PageLayout";
import { EmptyFilterResults } from "@/components/ui/EmptyFilterResults";
import { FilterGroup } from "@/components/ui/FilterGroup";
import { LoadingMessage, QueryErrorState } from "@/components/ui/QueryFeedback";
import { SearchBar } from "@/components/ui/SearchBar";
import { WaterfallCard } from "@/components/waterfalls/WaterfallCard";
import { useParks } from "@/hooks/data/useParks";
import { useWaterfallFilters, useWaterfalls } from "@/hooks/data/useWaterfalls";
import { waterfallAccessFilterLabels } from "@/lib/constants/labels";
import { formatCountLabel } from "@/lib/format";

const accessOptions = Object.entries(waterfallAccessFilterLabels).map(([value, label]) => ({
  value,
  label,
}));

export default function WaterfallsPage() {
  const parks = useParks();
  const waterfalls = useWaterfalls();
  const [{ q, access, park }, setFilters] = useWaterfallFilters();

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setFilters({ q: e.target.value }),
    [setFilters],
  );

  const handleClearSearch = useCallback(() => setFilters({ q: "" }), [setFilters]);

  const handleClearFilters = useCallback(
    () => setFilters({ q: "", access: "", park: "" }),
    [setFilters],
  );

  const parkOptions = useMemo(
    () => parks.data?.map((p) => ({ value: p.slug, label: p.name })) ?? [],
    [parks.data],
  );

  const waterfallCount = waterfalls.data?.length ?? 0;

  return (
    <PageLayout
      title="Cachoeiras"
      subtitle={formatCountLabel(waterfallCount, "cachoeira encontrada", "cachoeiras encontradas")}
    >
      <SearchBar
        value={q}
        onChange={handleSearch}
        onClear={handleClearSearch}
        placeholder="Buscar cachoeira ou parque..."
        ariaLabel="Buscar cachoeira ou parque..."
        className="mb-5"
      />

      <FilterGroup
        label="Dificuldade de acesso"
        options={accessOptions}
        value={access}
        onChange={(value) => setFilters({ access: value })}
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

      {waterfalls.isLoading ? (
        <LoadingMessage>Carregando cachoeiras...</LoadingMessage>
      ) : waterfalls.error ? (
        <QueryErrorState onRetry={() => waterfalls.refetch()}>
          Erro ao carregar cachoeiras.
        </QueryErrorState>
      ) : !waterfalls.data?.length ? (
        <EmptyFilterResults
          icon={Droplets}
          message="Nenhuma cachoeira encontrada com esses filtros."
          onClearFilters={handleClearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {waterfalls.data.map((wf) => (
            <WaterfallCard key={wf.id} waterfall={wf} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
