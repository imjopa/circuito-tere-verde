import type { TrailDifficulty } from "../../data/trails";
import styles from "./DifficultyBadge.module.css";

const difficultyConfig = {
  easy: { label: "Fácil", className: "easy" },
  medium: { label: "Moderado", className: "medium" },
  hard: { label: "Difícil", className: "hard" },
};

export interface DifficultyBadgeProps {
  difficulty: TrailDifficulty;
}

export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty] ?? difficultyConfig.easy;

  return <span className={`${styles.badge} ${styles[config.className]}`}>{config.label}</span>;
}
