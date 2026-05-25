import {
  ArrowRight,
  Calendar,
  Clock,
  Droplets,
  Footprints,
  Map,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { EventCard } from "@/components/events/EventCard";
import Navbar from "@/components/layout/Navbar";
import ParkCard from "@/components/parks/ParkCard";
import { Link } from "@/components/ui/Link";
import { LoadingMessage } from "@/components/ui/QueryFeedback";
import { SearchBar } from "@/components/ui/SearchBar";
import SearchResults from "@/components/ui/SearchResults";
import { useEvents } from "@/hooks/data/useEvents";
import { useParks } from "@/hooks/data/useParks";
import { useSearch, useSearchFilters } from "@/hooks/data/useSearch";

const QUICK_ACCESS: { icon: LucideIcon; label: string; to: string }[] = [
  { icon: Footprints, label: "Trilhas", to: "/trilhas" },
  { icon: Droplets, label: "Cachoeiras", to: "/cachoeiras" },
  { icon: Calendar, label: "Eventos", to: "/eventos" },
  { icon: Clock, label: "Horários", to: "/horarios" },
  { icon: Map, label: "Mapas", to: "/mapas" },
  { icon: Phone, label: "Contato", to: "/contato" },
];

export default function HomePage() {
  const parks = useParks();
  const events = useEvents();

  const [{ q }, setFilters] = useSearchFilters();
  const search = useSearch();
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const results = q.trim().length >= 2 ? (search.data ?? null) : null;

  const clearSearch = useCallback(() => setFilters({ q: "" }), [setFilters]);

  const upcomingEvents =
    events.data
      ?.filter((ev) => new Date(ev.date) >= new Date())
      .toSorted((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3) ?? [];

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
      return setFilters({ q: e.target.value });
    },
    [setFilters],
  );

  const handleClear = useCallback(() => {
    setShowResults(false);
    return clearSearch();
  }, [clearSearch]);

  const handleCloseResults = useCallback(() => {
    setShowResults(false);
  }, []);

  const handleFocus = useCallback(() => {
    if (q.length < 2) return;
    setShowResults(true);
  }, [q]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

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

      <div className="relative z-20 mx-auto -mt-6 max-w-2xl px-6" ref={searchRef}>
        <SearchBar
          value={q}
          onChange={handleQueryChange}
          onClear={handleClear}
          onFocus={handleFocus}
          placeholder="Buscar trilhas, cachoeiras, parques..."
          ariaLabel="Buscar no Circuito Terê Verde"
          variant="hero"
          ariaExpanded={showResults && !!results}
        >
          {results && showResults && (
            <SearchResults
              results={results}
              isLoading={search.isLoading}
              onClose={handleCloseResults}
            />
          )}
        </SearchBar>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <section id="parques" className="mb-14">
          <h2 className="mb-1.5 text-xl text-green-800">Os 3 parques</h2>
          <p className="mb-6 text-sm text-gray-500">
            Três áreas de conservação com biodiversidade única da Mata Atlântica
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {parks.isLoading ? (
              <LoadingMessage>Carregando parques...</LoadingMessage>
            ) : (
              (parks.data?.map((park) => <ParkCard key={park.id} park={park} />) ?? [])
            )}
          </div>
        </section>

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
            {events.isLoading ? (
              <LoadingMessage>Carregando eventos...</LoadingMessage>
            ) : (
              upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} variant="compact" />
              ))
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
