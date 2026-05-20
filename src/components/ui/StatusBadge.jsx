import styles from './StatusBadge.module.css'

/**
 * StatusBadge — exibe o status de uma trilha ou recurso do parque.
 *
 * @param {'open'|'closed'|'maintenance'|'climate_risk'|'full'} status
 */

const STATUS_CONFIG = {
  open:         { label: 'Aberta',          className: 'open'        },
  closed:       { label: 'Fechada',         className: 'closed'      },
  maintenance:  { label: 'Manutenção',      className: 'maintenance' },
  climate_risk: { label: 'Risco Climático', className: 'climateRisk' },
  full:         { label: 'Lotada',          className: 'full'        },
}

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.open

  return (
    <span className={`${styles.badge} ${styles[config.className]}`}>
      {config.label}
    </span>
  )
}
