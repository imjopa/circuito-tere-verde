import { Droplets } from "lucide-react";
import { useCallback } from "react";

import { PageLayout } from "@/components/layout/PageLayout";
import { EmptyFilterResults } from "@/components/ui/EmptyFilterResults";
import { FilterGroup } from "@/components/ui/FilterGroup";
import { LoadingMessage, QueryErrorState } from "@/components/ui/QueryFeedback";
import { WaterfallCard } from "@/components/waterfalls/WaterfallCard";
import { useWaterfallFilters, useWaterfalls } from "@/hooks/data/useWaterfalls";
import { waterfallAccessFilterLabels } from "@/lib/constants/labels";
import { formatCountLabel } from "@/lib/format";

const accessOptions = Object.entries(waterfallAccessFilterLabels).map(([value, label]) => ({
  value,
  label,
}));

export default function WaterfallsPage() {
  const waterfalls = useWaterfalls();
  const [{ access }, setFilters] = useWaterfallFilters();

  const handleClearFilters = useCallback(() => setFilters({ access: "" }), [setFilters]);

  const waterfallCount = waterfalls.data?.length ?? 0;

  return (
    <PageLayout
      title="Cachoeiras"
      subtitle={formatCountLabel(waterfallCount, "cachoeira encontrada", "cachoeiras encontradas")}
    >
      <FilterGroup
        label="Dificuldade de acesso"
        options={accessOptions}
        value={access}
        onChange={(value) => setFilters({ access: value })}
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
