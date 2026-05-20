import Navbar from '../components/layout/Navbar'
import TrailCard from '../components/trails/TrailCard'
import { useTrailFilters } from '../hooks/useTrailFilters'
import styles from './TrailsPage.module.css'

const difficultyFilters = [
  { value: 'all',    label: 'Todas'    },
  { value: 'easy',   label: 'Fácil'   },
  { value: 'medium', label: 'Moderado' },
  { value: 'hard',   label: 'Difícil'  },
]

const parkFilters = [
  { value: 'all',                       label: 'Todos os parques'         },
  { value: 'serra-dos-orgaos',          label: 'Serra dos Órgãos'         },
  { value: 'tres-picos',                label: 'Três Picos'               },
  { value: 'montanhas-teresopolis',     label: 'Montanhas de Teresópolis' },
]

export default function TrailsPage() {
  const {
    searchQuery, setSearchQuery,
    activeDifficulty, setActiveDifficulty,
    activePark, setActivePark,
    filteredTrails,
  } = useTrailFilters()

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderContent}>
          <h1 className={styles.pageTitle}>Trilhas</h1>
          <p className={styles.pageSubtitle}>
            {filteredTrails.length} trilha{filteredTrails.length !== 1 ? 's' : ''} encontrada{filteredTrails.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <main className={styles.main}>
        {/* Busca */}
        <div className={styles.searchBar}>
          <span>🔍</span>
          <input
            type="text"
            placeholder="Buscar trilha ou parque..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className={styles.clearBtn}>✕</button>
          )}
        </div>

        {/* Filtros dificuldade */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Dificuldade:</span>
          <div className={styles.filterChips}>
            {difficultyFilters.map(filter => (
              <button
                key={filter.value}
                className={`${styles.chip} ${activeDifficulty === filter.value ? styles.chipActive : ''}`}
                onClick={() => setActiveDifficulty(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtros parque */}
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Parque:</span>
          <div className={styles.filterChips}>
            {parkFilters.map(filter => (
              <button
                key={filter.value}
                className={`${styles.chip} ${activePark === filter.value ? styles.chipActive : ''}`}
                onClick={() => setActivePark(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de trilhas */}
        {filteredTrails.length > 0 ? (
          <div className={styles.grid}>
            {filteredTrails.map(trail => (
              <TrailCard key={trail.id} trail={trail} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <span>🌿</span>
            <p>Nenhuma trilha encontrada com esses filtros.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveDifficulty('all'); setActivePark('all') }}
              className={styles.resetBtn}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
