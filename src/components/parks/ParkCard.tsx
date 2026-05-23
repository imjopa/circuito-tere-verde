import styles from "./ParkCard.module.css";
import type { Park } from "../../data/parks";

export interface ParkCardProps {
  park: Park;
}

export default function ParkCard({ park }: ParkCardProps) {
  return (
    <article
      className={styles.card}
      style={{ "--accent": park.colorAccent } as React.CSSProperties}
    >
      <div className={styles.header}>
        <span className={styles.type}>{park.type}</span>
        <span className={styles.statusDot} title={park.status === "open" ? "Aberto" : "Fechado"} />
      </div>

      <h3 className={styles.name}>{park.name}</h3>
      <p className={styles.description}>{park.description}</p>

      <ul className={styles.metaList}>
        <li>
          <span className={styles.metaLabel}>Área</span>
          <span>{park.area}</span>
        </li>
        <li>
          <span className={styles.metaLabel}>Altitude máx.</span>
          <span>{park.altitude}</span>
        </li>
        <li>
          <span className={styles.metaLabel}>Horários</span>
          <span>{park.openingHours}</span>
        </li>
        <li>
          <span className={styles.metaLabel}>Entrada</span>
          <span>{park.entranceFee}</span>
        </li>
      </ul>

      <div className={styles.tags}>
        {park.biodiversity.map((item) => (
          <span key={item} className={styles.tag}>
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}
