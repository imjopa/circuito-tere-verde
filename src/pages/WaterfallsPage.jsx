import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import { waterfalls } from '../data/waterfalls'
import styles from './WaterfallsPage.module.css'

const ACCESS_FILTERS = [
  { value: 'all',    label: 'Todas'   },
  { value: 'easy',   label: 'Fácil'   },
  { value: 'medium', label: 'Moderado'},
  { value: 'hard',   label: 'Difícil' },
]

const ACCESS_CONFIG = {
  easy:   { label: 'Fácil acesso',    className: 'easy'   },
  medium: { label: 'Acesso moderado', className: 'medium' },
  hard:   { label: 'Acesso difícil',  className: 'hard'   },
}

export default function WaterfallsPage() {
  const [activeAccess, setActiveAccess] = useState('all')

  const filtered = waterfalls.filter(
    wf => activeAccess === 'all' || wf.access === activeAccess
  )

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderContent}>
          <h1 className={styles.pageTitle}>Cachoeiras</h1>
          <p className={styles.pageSubtitle}>{filtered.length} cachoeira{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.filterRow}>
          <span className={styles.filterLabel}>Dificuldade de acesso:</span>
          <div className={styles.filterChips}>
            {ACCESS_FILTERS.map(f => (
              <button
                key={f.value}
                className={`${styles.chip} ${activeAccess === f.value ? styles.chipActive : ''}`}
                onClick={() => setActiveAccess(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {filtered.map(wf => {
            const accessCfg = ACCESS_CONFIG[wf.access]
            return (
              <article key={wf.id} className={styles.card}>
                <div className={styles.cardHeader} data-park={wf.parkId}>
                  <div className={styles.cardBadges}>
                    <span className={`${styles.accessBadge} ${styles[accessCfg.className]}`}>
                      {accessCfg.label}
                    </span>
                    {wf.allowsBathing && (
                      <span className={styles.bathingBadge}>💧 Permite banho</span>
                    )}
                  </div>
                  <h2 className={styles.cardName}>{wf.name}</h2>
                  <p className={styles.cardPark}>{wf.parkName}</p>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.metaRow}>
                    <span className={styles.metaItem}>⬆️ {wf.height}</span>
                    <span className={styles.metaItem}>🏞️ {wf.parkName.split(' ')[0]}</span>
                  </div>

                  <p className={styles.description}>{wf.description}</p>

                  <div className={styles.infoBlock}>
                    <p className={styles.infoLabel}>Como chegar</p>
                    <p className={styles.infoText}>{wf.howToGet}</p>
                  </div>

                  <div className={styles.infoBlock}>
                    <p className={styles.infoLabel}>Acessibilidade</p>
                    <p className={styles.infoText}>{wf.accessibility}</p>
                  </div>

                  <div className={styles.tips}>
                    <p className={styles.tipsLabel}>Dicas</p>
                    <ul className={styles.tipsList}>
                      {wf.tips.map((tip, i) => (
                        <li key={i} className={styles.tipItem}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </main>
    </div>
  )
}
