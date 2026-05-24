import { Mountain, Ruler, Timer } from "lucide-react";
import { tv } from "tailwind-variants";
import StatusBadge from "../ui/StatusBadge";
import DifficultyBadge from "../ui/DifficultyBadge";
import type { Trail } from "../../data/trails";

const trailCard = tv({
  slots: {
    root: "overflow-hidden rounded-lg border border-gray-100 bg-white transition hover:-translate-y-0.5 hover:shadow-md",
    imageArea:
      "relative flex h-[100px] flex-col justify-end bg-green-700 p-3 px-4 data-[park=serra-dos-orgaos]:bg-linear-to-br data-[park=serra-dos-orgaos]:from-green-900 data-[park=serra-dos-orgaos]:to-green-800 data-[park=tres-picos]:bg-linear-to-br data-[park=tres-picos]:from-green-800 data-[park=tres-picos]:to-green-700 data-[park=montanhas-teresopolis]:bg-linear-to-br data-[park=montanhas-teresopolis]:from-green-700 data-[park=montanhas-teresopolis]:to-green-600 [&>:first-child]:absolute [&>:first-child]:top-2.5 [&>:first-child]:right-3",
    name: "font-display text-base text-white",
    body: "px-4 py-3.5",
    metaRow: "mb-2.5 flex gap-4",
    metaItem: "flex items-center gap-1 text-xs text-gray-500",
    metaIcon: "size-3.5 shrink-0",
    footer: "flex items-center justify-between",
    parkName: "text-xs text-gray-500",
    conditions: "mt-2.5 rounded-sm bg-gray-100 px-3 py-2 text-xs leading-relaxed text-gray-500",
  },
});

export interface TrailCardProps {
  trail: Trail;
}

export default function TrailCard({ trail }: TrailCardProps) {
  const styles = trailCard();

  return (
    <article className={styles.root()}>
      <div className={styles.imageArea()} data-park={trail.parkId}>
        <StatusBadge status={trail.status} />
        <h3 className={styles.name()}>{trail.name}</h3>
      </div>

      <div className={styles.body()}>
        <div className={styles.metaRow()}>
          <span className={styles.metaItem()}>
            <Ruler className={styles.metaIcon()} aria-hidden />
            {trail.distance} km
          </span>
          <span className={styles.metaItem()}>
            <Timer className={styles.metaIcon()} aria-hidden />
            {trail.duration}
          </span>
          <span className={styles.metaItem()}>
            <Mountain className={styles.metaIcon()} aria-hidden />
            {trail.altitude} m
          </span>
        </div>

        <div className={styles.footer()}>
          <DifficultyBadge difficulty={trail.difficulty} />
          <span className={styles.parkName()}>{trail.parkName}</span>
        </div>

        {trail.conditions && <p className={styles.conditions()}>{trail.conditions}</p>}
      </div>
    </article>
  );
}
