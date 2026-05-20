import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import { events } from '../data/events'
import styles from './EventsPage.module.css'

const CATEGORY_FILTERS = [
  { value: 'all',           label: 'Todos'       },
  { value: 'guided_trail',  label: 'Trilha Guiada'},
  { value: 'education',     label: 'Educativo'   },
  { value: 'volunteer',     label: 'Voluntário'  },
  { value: 'workshop',      label: 'Workshop'    },
]

const CATEGORY_COLORS = {
  guided_trail: { bg: '#dcfce7', color: '#14532d' },
  education:    { bg: '#dbeafe', color: '#1e3a5f' },
  volunteer:    { bg: '#fef9c3', color: '#713f12' },
  workshop:     { bg: '#f3e8ff', color: '#4c1d95' },
}

const STATUS_CONFIG = {
  open:      { label: 'Vagas disponíveis', bg: '#dcfce7', color: '#14532d' },
  few_spots: { label: 'Últimas vagas',     bg: '#ffedd5', color: '#7c2d12' },
  full:      { label: 'Esgotado',          bg: '#fee2e2', color: '#7f1d1d' },
}

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = events
    .filter(ev => activeCategory === 'all' || ev.category === activeCategory)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderContent}>
          <h1 className={styles.pageTitle}>Eventos</h1>
          <p className={styles.pageSubtitle}>Atividades, trilhas guiadas e programas educativos nos parques</p>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.filterRow}>
          <span className={styles.filterLabel}>Categoria:</span>
          <div className={styles.filterChips}>
            {CATEGORY_FILTERS.map(f => (
              <button
                key={f.value}
                className={`${styles.chip} ${activeCategory === f.value ? styles.chipActive : ''}`}
                onClick={() => setActiveCategory(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className={styles.empty}>Nenhum evento nessa categoria no momento.</p>
        ) : (
          <div className={styles.list}>
            {filtered.map(ev => {
              const evDate   = new Date(ev.date + 'T00:00:00')
              const day      = evDate.getDate().toString().padStart(2, '0')
              const month    = evDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.','').toUpperCase()
              const weekday  = evDate.toLocaleDateString('pt-BR', { weekday: 'long' })
              const catColor = CATEGORY_COLORS[ev.category]
              const statusCfg = STATUS_CONFIG[ev.status] ?? STATUS_CONFIG.open
              const occupancy = Math.round(((ev.spots - ev.spotsLeft) / ev.spots) * 100)

              return (
                <article key={ev.id} className={styles.card}>
                  <div className={styles.dateCol}>
                    <span className={styles.dateDay}>{day}</span>
                    <span className={styles.dateMonth}>{month}</span>
                    <span className={styles.dateWeekday}>{weekday}</span>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardTop}>
                      <span className={styles.categoryBadge} style={{ background: catColor.bg, color: catColor.color }}>
                        {ev.categoryLabel}
                      </span>
                      <span className={styles.statusBadge} style={{ background: statusCfg.bg, color: statusCfg.color }}>
                        {statusCfg.label}
                      </span>
                    </div>

                    <h2 className={styles.cardTitle}>{ev.title}</h2>
                    <p className={styles.cardPark}>📍 {ev.park}</p>
                    <p className={styles.cardDescription}>{ev.description}</p>

                    <div className={styles.metaGrid}>
                      <span>🕐 {ev.time} · {ev.duration}</span>
                      <span>💰 {ev.price}</span>
                      <span>👥 {ev.spotsLeft} vagas restantes</span>
                    </div>

                    <div className={styles.occupancy}>
                      <div className={styles.occupancyBar}>
                        <div className={styles.occupancyFill} style={{ width: `${occupancy}%` }} />
                      </div>
                      <span className={styles.occupancyLabel}>{occupancy}% ocupado</span>
                    </div>

                    {ev.requirements?.length > 0 && (
                      <div className={styles.requirements}>
                        <span className={styles.requirementsLabel}>Requisitos: </span>
                        {ev.requirements.join(' · ')}
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
