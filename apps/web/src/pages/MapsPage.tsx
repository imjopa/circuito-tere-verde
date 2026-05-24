import { Clock, Globe, MapPin, Phone, Ticket } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useCallback } from "react";

import Navbar from "@/components/layout/Navbar";
import { useParks } from "@/hooks/data/useParks";

interface ParkMap {
  embedUrl: string;
  address: string;
  coordinates: string;
  phone: string;
}

const PARK_MAPS: Record<string, ParkMap | undefined> = {
  "serra-dos-orgaos": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14893.84!2d-43.0!3d-22.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9f2b35ef2a5b5f%3A0x1a2b3c4d5e6f7a8b!2sParque%20Nacional%20Serra%20dos%20%C3%93rg%C3%A3os!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr",
    address: "Av. Rotariana, s/n — Teresópolis, RJ",
    coordinates: "22°27'S, 43°00'W",
    phone: "(21) 97896-2463",
  },
  "tres-picos": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60000!2d-42.95!3d-22.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sParque%20Estadual%20Tr%C3%AAs%20Picos!5e0!3m2!1spt-BR!2sbr!4v1620000000001!5m2!1spt-BR!2sbr",
    address: "Estrada Friburgo-Teresópolis — Nova Friburgo, RJ",
    coordinates: "22°25'S, 42°58'W",
    phone: "(22) 2543-6200",
  },
  "montanhas-teresopolis": {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15000!2d-43.02!3d-22.48!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMontanhas%20de%20Teres%C3%B3polis!5e0!3m2!1spt-BR!2sbr!4v1620000000002!5m2!1spt-BR!2sbr",
    address: "Estrada do Parque s/n — Teresópolis, RJ",
    coordinates: "22°29'S, 43°01'W",
    phone: "(21) 2742-3831",
  },
};

export default function MapsPage() {
  const parks = useParks();
  const [parkId, setParkId] = useQueryState("park", parseAsString.withDefault(""));
  const activePark = parks.data?.find((p) => p.id === parkId);
  const activeMapData = PARK_MAPS[parkId ?? ""] ?? PARK_MAPS["serra-dos-orgaos"]!;

  if (parks.isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <p className="px-6 py-12 text-center text-sm text-gray-500">Carregando mapas...</p>
      </div>
    );
  }

  if (parks.error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <p className="px-6 py-12 text-center text-sm text-gray-500">Erro ao carregar mapas</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="bg-green-700 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl text-white">Mapas dos parques</h1>
          <p className="mt-1 text-sm text-white/65">Localize os parques e planeje sua visita</p>
        </div>
      </div>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
        <div className="flex flex-wrap gap-3">
          {parks.data?.map((park) => {
            const handleParkClick = useCallback(() => setParkId(park.id), [park.id]);

            return (
              <button
                key={park.id}
                className={`flex min-w-40 cursor-pointer flex-col gap-0.5 rounded-lg border px-5 py-3 text-left transition-colors ${
                  parkId === park.id
                    ? "border-green-700 bg-green-50"
                    : "border-gray-200 bg-white hover:border-green-400"
                }`}
                onClick={handleParkClick}
                aria-pressed={parkId === park.id}
              >
                <span className="text-sm font-medium text-gray-900">{park.name}</span>
                <span className="text-xs text-gray-500">{park.type}</span>
              </button>
            );
          })}
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
                  <p className="mb-px text-xs tracking-wider text-gray-500 uppercase">
                    Coordenadas
                  </p>
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
              href={`https://www.google.com/maps/search/${encodeURIComponent(activePark?.name + " Teresópolis")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-md bg-green-700 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-green-800"
            >
              Abrir no Google Maps →
            </a>
          </aside>
        </div>
      </main>
    </div>
  );
}
