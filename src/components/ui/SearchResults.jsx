import { useNavigate } from 'react-router-dom'
import styles from './SearchResults.module.css'

/**
 * SearchResults — dropdown que aparece sob a barra de busca na Home.
 * Exibe resultados agrupados por categoria.
 */
export default function SearchResults({ results, onClose }) {
  const navigate = useNavigate()

  if (!results || results.total === 0) {
    return (
      <div className={styles.dropdown} role="status" aria-live="polite">
        <p className={styles.empty}>Nenhum resultado encontrado.</p>
      </div>
    )
  }

  function handleTrailClick() {
    onClose()
    navigate('/trilhas')
  }

  function handleWaterfallClick() {
    onClose()
    navigate('/cachoeiras')
  }

  return (
    <div className={styles.dropdown} role="listbox" aria-label="Resultados da busca">

      {results.parks.length > 0 && (
        <div className={styles.group}>
          <span className={styles.groupLabel}>Parques</span>
          {results.parks.map(park => (
            <button
              key={park.id}
              className={styles.resultItem}
              onClick={onClose}
              role="option"
            >
              <span className={styles.resultIcon}>🏞️</span>
              <div>
                <p className={styles.resultName}>{park.name}</p>
                <p className={styles.resultMeta}>{park.type}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {results.trails.length > 0 && (
        <div className={styles.group}>
          <span className={styles.groupLabel}>Trilhas</span>
          {results.trails.map(trail => (
            <button
              key={trail.id}
              className={styles.resultItem}
              onClick={handleTrailClick}
              role="option"
            >
              <span className={styles.resultIcon}>🥾</span>
              <div>
                <p className={styles.resultName}>{trail.name}</p>
                <p className={styles.resultMeta}>{trail.parkName} · {trail.difficultyLabel}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {results.waterfalls.length > 0 && (
        <div className={styles.group}>
          <span className={styles.groupLabel}>Cachoeiras</span>
          {results.waterfalls.map(wf => (
            <button
              key={wf.id}
              className={styles.resultItem}
              onClick={handleWaterfallClick}
              role="option"
            >
              <span className={styles.resultIcon}>💧</span>
              <div>
                <p className={styles.resultName}>{wf.name}</p>
                <p className={styles.resultMeta}>{wf.parkName} · {wf.accessLabel}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <span>{results.total} resultado{results.total !== 1 ? 's' : ''} encontrado{results.total !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}
