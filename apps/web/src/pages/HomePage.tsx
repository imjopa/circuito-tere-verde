import {
  ArrowRight,
  Calendar,
  Clock,
  Droplets,
  Footprints,
  Map,
  Phone,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import ParkCard from "@/components/parks/ParkCard";
import { Link } from "@/components/ui/Link";
import SearchResults from "@/components/ui/SearchResults";
import { useEvents } from "@/hooks/useEvents";
import { useHomeSearch } from "@/hooks/useHomeSearch";
import { useParks } from "@/hooks/useParks";

// Atalhos rápidos com rotas reais
const QUICK_ACCESS: { icon: LucideIcon; label: string; to: string }[] = [
  { icon: Footprints, label: "Trilhas", to: "/trilhas" },
  { icon: Droplets, label: "Cachoeiras", to: "/cachoeiras" },
  { icon: Calendar, label: "Eventos", to: "/eventos" },
  { icon: Clock, label: "Horários", to: "/horarios" },
  { icon: Map, label: "Mapas", to: "/mapas" },
  { icon: Phone, label: "Contato", to: "/contato" },
];

export default function HomePage() {
  const { query, setQuery, clearSearch, results } = useHomeSearch();
  const { parks, loading: parksLoading } = useParks();
  const { events, loading: eventsLoading } = useEvents();
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const upcomingEvents = events
    .filter((ev) => new Date(ev.date) >= new Date())
    .toSorted((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const abortController = new AbortController();

    document.addEventListener(
      "mousedown",
      (e) => {
        if (searchRef.current == null) return;
        if (!searchRef.current.contains(e.target as Node)) {
          setShowResults(false);
        }
      },
      { signal: abortController.signal },
    );

    return () => abortController.abort();
  }, []);

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setShowResults(true);
      return setQuery(e.target.value);
    },
    [setQuery],
  );

  const handleClear = useCallback(() => {
    setShowResults(false);
    return clearSearch();
  }, [clearSearch]);

  const handleCloseResults = useCallback(() => {
    setShowResults(false);
  }, []);

  const handleFocus = useCallback(() => {
    if (query.length < 2) return;
    setShowResults(true);
  }, [query]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-green-700 px-6 pt-16 pb-20">
        <div className="mx-auto max-w-xl">
          <span className="mb-4 inline-block rounded-full bg-green-400 px-3 py-1 text-xs font-medium text-green-900">
            Teresópolis, RJ
          </span>
          <h1 className="mb-4 text-3xl leading-tight text-white sm:text-4xl">
            Explore os parques de
            <br />
            Teresópolis com consciência
          </h1>
          <p className="mb-7 text-base leading-relaxed text-white/75">
            Trilhas, cachoeiras, fauna e flora — tudo em um só lugar.
            <br />
            Turismo responsável começa com informação.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/trilhas">Explorar trilhas</Link>
            <Link to="#parques" variant="outline">
              Ver parques
            </Link>
          </div>
        </div>
        <div
          className="pointer-events-none absolute -top-16 -right-16 size-72 rounded-full bg-green-400/10"
          aria-hidden="true"
        />
      </section>

      {/* Busca funcional */}
      <div className="relative z-20 mx-auto -mt-6 max-w-2xl px-6" ref={searchRef}>
        <search
          className="flex items-center gap-3 rounded-full border border-gray-100 bg-white px-4 py-2.5 shadow-lg"
          aria-expanded={showResults && !!results}
        >
          <Search className="size-5 shrink-0 text-gray-400" aria-hidden />
          <input
            type="search"
            placeholder="Buscar trilhas, cachoeiras, parques..."
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
            className="font-body flex-1 border-none bg-transparent text-sm text-gray-700 outline-none [&::-webkit-search-cancel-button]:hidden"
            aria-label="Buscar no Circuito Terê Verde"
            aria-autocomplete="list"
          />
          {query && (
            <button
              onClick={handleClear}
              className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-gray-100 text-xs text-gray-500"
              aria-label="Limpar busca"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          )}
        </search>
        {showResults && results !== null && (
          <SearchResults results={results} onClose={handleCloseResults} />
        )}
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        {/* Parques */}
        <section id="parques" className="mb-14">
          <h2 className="mb-1.5 text-xl text-green-800">Os 3 parques</h2>
          <p className="mb-6 text-sm text-gray-500">
            Três áreas de conservação com biodiversidade única da Mata Atlântica
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {parksLoading ? (
              <p className="text-sm text-gray-500">Carregando parques...</p>
            ) : (
              parks.map((park) => <ParkCard key={park.id} park={park} />)
            )}
          </div>
        </section>

        {/* Acesso rápido */}
        <section className="mb-14" aria-label="Acesso rápido">
          <h2 className="mb-1.5 text-xl text-green-800">Acesso rápido</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {QUICK_ACCESS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex flex-col items-center gap-2 rounded-md border border-gray-100 bg-white px-3 py-4 transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-sm"
              >
                <item.icon className="size-8 text-green-700" aria-hidden />
                <span className="text-center text-sm text-gray-500">{item.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Próximos eventos */}
        <section id="eventos" className="mb-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="mb-1 text-xl text-green-800">Próximos eventos</h2>
              <p className="text-sm text-gray-500">Atividades e trilhas guiadas nos parques</p>
            </div>
            <Link to="/eventos">
              <span className="flex items-center gap-1">
                Ver todos <ArrowRight className="size-4" />
              </span>
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {eventsLoading ? (
              <p className="text-sm text-gray-500">Carregando eventos...</p>
            ) : (
              upcomingEvents.map((event) => {
                const evDate = new Date(event.date + "T00:00:00");
                const day = evDate.getDate().toString().padStart(2, "0");
                const month = evDate
                  .toLocaleDateString("pt-BR", { month: "short" })
                  .replace(".", "")
                  .toUpperCase();
                return (
                  <article
                    key={event.id}
                    className="flex items-center gap-4 rounded-md border border-gray-100 bg-white px-5 py-4 transition hover:shadow-sm"
                  >
                    <div className="min-w-11 shrink-0 rounded-md bg-green-700 px-3 py-1.5 text-center text-white">
                      <span className="block text-lg leading-tight font-semibold">{day}</span>
                      <span className="text-xs uppercase opacity-80">{month}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {event.park} · {event.price}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs whitespace-nowrap text-green-800">
                      {event.categoryLabel}
                    </span>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-1 bg-green-800 px-6 py-6 text-center text-sm text-white/60">
        <p>© 2025 Circuito Terê Verde — Explore, Preserve, Conecte-se</p>
        <p className="text-xs opacity-70">
          Projeto acadêmico — UNIFESO · Desenvolvimento de MVP Front-End
        </p>
      </footer>
    </div>
  );
}
