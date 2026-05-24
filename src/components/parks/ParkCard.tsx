import { tv } from "tailwind-variants";
import type { Park } from "../../data/parks";

const parkCard = tv({
  slots: {
    root: "rounded-lg border border-gray-100 border-t-4 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md",
    header: "mb-3 flex items-center justify-between",
    type: "text-[0.6875rem] font-medium tracking-wide text-gray-500 uppercase",
    statusDot: "size-2 rounded-full bg-green-400",
    name: "mb-2 text-lg text-green-800",
    description: "mb-4 text-xs leading-relaxed text-gray-500",
    metaList: "mb-4 flex list-none flex-col gap-1.5 rounded-md bg-green-50 p-3",
    metaRow: "flex justify-between text-xs",
    metaLabel: "text-gray-500",
    tags: "flex flex-wrap gap-1.5",
    tag: "rounded-full bg-green-100 px-2.5 py-0.5 text-[0.6875rem] text-green-800",
  },
});

export interface ParkCardProps {
  park: Park;
}

export default function ParkCard({ park }: ParkCardProps) {
  const styles = parkCard();

  return (
    <article className={styles.root()} style={{ borderTopColor: park.colorAccent }}>
      <div className={styles.header()}>
        <span className={styles.type()}>{park.type}</span>
        <span
          className={styles.statusDot()}
          title={park.status === "open" ? "Aberto" : "Fechado"}
        />
      </div>

      <h3 className={styles.name()}>{park.name}</h3>
      <p className={styles.description()}>{park.description}</p>

      <ul className={styles.metaList()}>
        <li className={styles.metaRow()}>
          <span className={styles.metaLabel()}>Área</span>
          <span>{park.area}</span>
        </li>
        <li className={styles.metaRow()}>
          <span className={styles.metaLabel()}>Altitude máx.</span>
          <span>{park.altitude}</span>
        </li>
        <li className={styles.metaRow()}>
          <span className={styles.metaLabel()}>Horários</span>
          <span>{park.openingHours}</span>
        </li>
        <li className={styles.metaRow()}>
          <span className={styles.metaLabel()}>Entrada</span>
          <span>{park.entranceFee}</span>
        </li>
      </ul>

      <div className={styles.tags()}>
        {park.biodiversity.map((item) => (
          <span key={item} className={styles.tag()}>
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}
