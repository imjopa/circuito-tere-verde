import StatusBadge from '../ui/StatusBadge'
import DifficultyBadge from '../ui/DifficultyBadge'
import styles from './TrailCard.module.css'

export default function TrailCard({ trail }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageArea} data-park={trail.parkId}>
        <StatusBadge status={trail.status} />
        <h3 className={styles.name}>{trail.name}</h3>
      </div>

      <div className={styles.body}>
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>📏</span>
            {trail.distance} km
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>⏱️</span>
            {trail.duration}
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>⛰️</span>
            {trail.altitude} m
          </span>
        </div>

        <div className={styles.footer}>
          <DifficultyBadge difficulty={trail.difficulty} />
          <span className={styles.parkName}>{trail.parkName}</span>
        </div>

        {trail.conditions && (
          <p className={styles.conditions}>{trail.conditions}</p>
        )}
      </div>
    </article>
  )
}
