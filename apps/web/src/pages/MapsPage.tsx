import type { Park } from "@circuito/db/client";
import { Clock, Globe, MapPin, Phone, Ticket } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

import { PageLayout } from "@/components/layout/PageLayout";
import { LoadingMessage, QueryErrorState } from "@/components/ui/QueryFeedback";
import { useParks } from "@/hooks/data/useParks";
import { PARK_MAPS } from "@/lib/constants/parkMaps";

export default function MapsPage() {
  const parks = useParks();
  const [parkSlug, setParkSlug] = useQueryState("park", parseAsString.withDefault(""));
  const activePark = parks.data?.find((p) => p.slug === parkSlug);
  const activeMapData = PARK_MAPS[parkSlug ?? ""] ?? PARK_MAPS["serra-dos-orgaos"]!;

  if (parks.isLoading) {
    return (
      <PageLayout mainClassName="mx-auto max-w-6xl px-6 py-8">
        <LoadingMessage>Carregando mapas...</LoadingMessage>
      </PageLayout>
    );
  }

  if (parks.error) {
    return (
      <PageLayout mainClassName="mx-auto max-w-6xl px-6 py-8">
        <QueryErrorState onRetry={() => parks.refetch()}>Erro ao carregar mapas.</QueryErrorState>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Mapas dos parques"
      subtitle="Localize os parques e planeje sua visita"
      mainClassName="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8"
    >
      <div className="flex flex-wrap gap-3">
        {parks.data?.map((park) => (
          <ParkSelectorButton
            key={park.slug}
            park={park}
            isActive={parkSlug === park.slug}
            onSelect={() => setParkSlug(park.slug)}
          />
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="aspect-16/10 overflow-hidden rounded-lg border border-gray-100 lg:col-span-2">
          {/* TODO: ver quais atributos sandbox são necessários pro maps funcionar */}
          {/* oxlint-disable-next-line react/iframe-missing-sandbox */}
          <iframe
            src={activeMapData.embedUrl}
            className="block h-full w-full border-none"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Mapa do ${activePark?.name}`}
            aria-label={`Mapa interativo do ${activePark?.name}`}
          />
        </div>

        <aside className="sticky top-20 flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-5">
          <h2 className="text-lg font-semibold text-green-800">{activePark?.name}</h2>
          <p className="-mt-1.5 text-xs text-gray-500">{activePark?.type}</p>

          <div className="flex flex-col gap-3.5">
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-px size-4 shrink-0 text-green-700" aria-hidden />
              <div>
                <p className="mb-px text-xs tracking-wider text-gray-500 uppercase">Endereço</p>
                <p className="text-sm leading-snug text-gray-800">{activeMapData.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Globe className="mt-px size-4 shrink-0 text-green-700" aria-hidden />
              <div>
                <p className="mb-px text-xs tracking-wider text-gray-500 uppercase">Coordenadas</p>
                <p className="text-sm leading-snug text-gray-800">{activeMapData.coordinates}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="mt-px size-4 shrink-0 text-green-700" aria-hidden />
              <div>
                <p className="mb-px text-xs tracking-wider text-gray-500 uppercase">
                  Horário de funcionamento
                </p>
                <p className="text-sm leading-snug text-gray-800">{activePark?.openingHours}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Phone className="mt-px size-4 shrink-0 text-green-700" aria-hidden />
              <div>
                <p className="mb-px text-xs tracking-wider text-gray-500 uppercase">Telefone</p>
                <p className="text-sm leading-snug text-gray-800">{activeMapData.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Ticket className="mt-px size-4 shrink-0 text-green-700" aria-hidden />
              <div>
                <p className="mb-px text-xs tracking-wider text-gray-500 uppercase">Entrada</p>
                <p className="text-sm leading-snug text-gray-800">
                  {((activePark?.entranceFeeCents ?? 0) / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(`${activePark?.name} Teresópolis`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-md bg-green-700 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-green-800"
          >
            Abrir no Google Maps →
          </a>
        </aside>
      </div>
    </PageLayout>
  );
}

function ParkSelectorButton({
  park,
  isActive,
  onSelect,
}: {
  park: Park;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={`flex min-w-40 cursor-pointer flex-col gap-0.5 rounded-lg border px-5 py-3 text-left transition-colors ${
        isActive
          ? "border-green-700 bg-green-50"
          : "border-gray-200 bg-white hover:border-green-400"
      }`}
      onClick={onSelect}
      aria-pressed={isActive}
    >
      <span className="text-sm font-medium text-gray-900">{park.name}</span>
      <span className="text-xs text-gray-500">{park.type}</span>
    </button>
  );
}
