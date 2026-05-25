import { Calendar } from "lucide-react";
import { useCallback, useMemo } from "react";

import { EventCard } from "@/components/events/EventCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { EmptyFilterResults } from "@/components/ui/EmptyFilterResults";
import { FilterGroup } from "@/components/ui/FilterGroup";
import { LoadingMessage, QueryErrorState } from "@/components/ui/QueryFeedback";
import { SearchBar } from "@/components/ui/SearchBar";
import { useEventFilters, useEvents } from "@/hooks/data/useEvents";
import { useParks } from "@/hooks/data/useParks";
import { categoryLabels } from "@/lib/constants/labels";

const categoryOptions = Object.entries(categoryLabels).map(([value, label]) => ({ value, label }));

export default function EventsPage() {
  const parks = useParks();
  const events = useEvents();
  const [{ q, category, park }, setFilters] = useEventFilters();

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setFilters({ q: e.target.value }),
    [setFilters],
  );

  const handleClearSearch = useCallback(() => setFilters({ q: "" }), [setFilters]);

  const handleClearFilters = useCallback(
    () => setFilters({ q: "", category: "", park: "" }),
    [setFilters],
  );

  const parkOptions = useMemo(
    () => parks.data?.map((p) => ({ value: p.slug, label: p.name })) ?? [],
    [parks.data],
  );

  return (
    <PageLayout
      title="Eventos"
      subtitle="Atividades, trilhas guiadas e programas educativos nos parques"
    >
      <SearchBar
        value={q}
        onChange={handleSearch}
        onClear={handleClearSearch}
        placeholder="Buscar evento ou parque..."
        ariaLabel="Buscar evento ou parque..."
        className="mb-5"
      />

      <FilterGroup
        label="Categoria"
        options={categoryOptions}
        value={category}
        onChange={(value) => setFilters({ category: value })}
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

      {events.isLoading ? (
        <LoadingMessage>Carregando eventos...</LoadingMessage>
      ) : events.error ? (
        <QueryErrorState onRetry={() => events.refetch()}>
          Erro ao carregar eventos.
        </QueryErrorState>
      ) : events.data?.length === 0 ? (
        <EmptyFilterResults
          icon={Calendar}
          message="Nenhum evento encontrado com esses filtros."
          onClearFilters={handleClearFilters}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {events.data?.map((ev) => (
            <EventCard key={ev.id} event={ev} variant="full" />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
