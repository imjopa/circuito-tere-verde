import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import ParkCard from "../components/parks/ParkCard";
import SearchResults from "../components/ui/SearchResults";
import { useHomeSearch } from "../hooks/useHomeSearch";
import { parks } from "../data/parks";
import { events } from "../data/events";
import { btnOutline, btnPrimary } from "../lib/variants/button";
import { homePage } from "../lib/variants/home";

// Atalhos rápidos com rotas reais
const QUICK_ACCESS = [
  { icon: "🥾", label: "Trilhas", to: "/trilhas" },
  { icon: "💧", label: "Cachoeiras", to: "/cachoeiras" },
  { icon: "📅", label: "Eventos", to: "/eventos" },
  { icon: "🕐", label: "Horários", to: "/horarios" },
  { icon: "🗺️", label: "Mapas", to: "/mapas" },
  { icon: "📞", label: "Contato", to: "/contato" },
];

export default function HomePage() {
  const { query, setQuery, clearSearch, results } = useHomeSearch();
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const styles = homePage();

  // Próximos 3 eventos futuros
  const upcomingEvents = events
    .filter((ev) => new Date(ev.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
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

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowResults(true);
  };

  const handleClear = () => {
    clearSearch();
    setShowResults(false);
  };

  return (
    <div className={styles.page()}>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero()}>
        <div className={styles.heroContent()}>
          <span className={styles.heroTag()}>Teresópolis, RJ</span>
          <h1 className={styles.heroTitle()}>
            Explore os parques de
            <br />
            Teresópolis com consciência
          </h1>
          <p className={styles.heroSubtitle()}>
            Trilhas, cachoeiras, fauna e flora — tudo em um só lugar.
            <br />
            Turismo responsável começa com informação.
          </p>
          <div className={styles.heroBtns()}>
            <Link to="/trilhas" className={btnPrimary()}>
              Explorar trilhas
            </Link>
            <a href="#parques" className={btnOutline()}>
              Ver parques
            </a>
          </div>
        </div>
        <div className={styles.heroDecoration()} aria-hidden="true" />
      </section>

      {/* Busca funcional */}
      <div className={styles.searchWrapper()} ref={searchRef}>
        <div className={styles.searchBar()} role="search">
          <span aria-hidden="true">🔍</span>
          <input
            type="search"
            placeholder="Buscar trilhas, cachoeiras, parques..."
            value={query}
            onChange={handleQueryChange}
            onFocus={() => query.length >= 2 && setShowResults(true)}
            className={styles.searchInput()}
            aria-label="Buscar no Circuito Terê Verde"
            aria-autocomplete="list"
            aria-expanded={showResults && !!results}
          />
          {query && (
            <button onClick={handleClear} className={styles.clearBtn()} aria-label="Limpar busca">
              ✕
            </button>
          )}
        </div>
        {showResults && results !== null && (
          <SearchResults results={results} onClose={() => setShowResults(false)} />
        )}
      </div>

      <main className={styles.main()}>
        {/* Parques */}
        <section id="parques" className={styles.section()}>
          <h2 className={styles.sectionTitle()}>Os 3 parques</h2>
          <p className={styles.sectionSubtitle()}>
            Três áreas de conservação com biodiversidade única da Mata Atlântica
          </p>
          <div className={styles.parksGrid()}>
            {parks.map((park) => (
              <ParkCard key={park.id} park={park} />
            ))}
          </div>
        </section>

        {/* Acesso rápido */}
        <section className={styles.section()} aria-label="Acesso rápido">
          <h2 className={styles.sectionTitle()}>Acesso rápido</h2>
          <div className={styles.quickAccess()}>
            {QUICK_ACCESS.map((item) => (
              <Link key={item.label} to={item.to} className={styles.qaItem()}>
                <span className={styles.qaIcon()} aria-hidden="true">
                  {item.icon}
                </span>
                <span className={styles.qaLabel()}>{item.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Próximos eventos */}
        <section id="eventos" className={styles.section()}>
          <div className={styles.sectionHeader()}>
            <div>
              <h2 className={styles.sectionTitleInHeader()}>Próximos eventos</h2>
              <p className={styles.sectionSubtitleInHeader()}>
                Atividades e trilhas guiadas nos parques
              </p>
            </div>
            <Link to="/eventos" className={styles.seeAllLink()}>
              Ver todos →
            </Link>
          </div>
          <div className={styles.eventsList()}>
            {upcomingEvents.map((event) => {
              const evDate = new Date(event.date + "T00:00:00");
              const day = evDate.getDate().toString().padStart(2, "0");
              const month = evDate
                .toLocaleDateString("pt-BR", { month: "short" })
                .replace(".", "")
                .toUpperCase();
              return (
                <article key={event.id} className={styles.eventItem()}>
                  <div className={styles.eventDate()}>
                    <span className={styles.eventDay()}>{day}</span>
                    <span className={styles.eventMonth()}>{month}</span>
                  </div>
                  <div className={styles.eventInfo()}>
                    <h3 className={styles.eventTitle()}>{event.title}</h3>
                    <p className={styles.eventPark()}>
                      {event.park} · {event.price}
                    </p>
                  </div>
                  <span className={styles.eventTag()}>{event.categoryLabel}</span>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className={styles.footer()}>
        <p>© 2025 Circuito Terê Verde — Explore, Preserve, Conecte-se</p>
        <p className={styles.footerSub()}>
          Projeto acadêmico — UNIFESO · Desenvolvimento de MVP Front-End
        </p>
      </footer>
    </div>
  );
}
