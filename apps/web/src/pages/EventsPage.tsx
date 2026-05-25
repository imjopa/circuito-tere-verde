import { Calendar } from "lucide-react";
import { useCallback } from "react";

import { EventCard } from "@/components/events/EventCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { EmptyFilterResults } from "@/components/ui/EmptyFilterResults";
import { FilterGroup } from "@/components/ui/FilterGroup";
import { LoadingMessage, QueryErrorState } from "@/components/ui/QueryFeedback";
import { useEventFilters, useEvents } from "@/hooks/data/useEvents";
import { categoryLabels } from "@/lib/constants/labels";

const categoryOptions = Object.entries(categoryLabels).map(([value, label]) => ({ value, label }));

export default function EventsPage() {
  const events = useEvents();
  const [{ category }, setFilters] = useEventFilters();

  const handleClearFilters = useCallback(() => setFilters({ category: "" }), [setFilters]);

  return (
    <PageLayout
      title="Eventos"
      subtitle="Atividades, trilhas guiadas e programas educativos nos parques"
    >
      <FilterGroup
        label="Categoria"
        options={categoryOptions}
        value={category}
        onChange={(value) => setFilters({ category: value })}
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
