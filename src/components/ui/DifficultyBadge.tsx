import type { TrailDifficulty } from "../../data/trails";
import { difficultyBadge } from "../../lib/variants/badge";

const difficultyConfig = {
  easy: { label: "Fácil", difficulty: "easy" as const },
  medium: { label: "Moderado", difficulty: "medium" as const },
  hard: { label: "Difícil", difficulty: "hard" as const },
};

export interface DifficultyBadgeProps {
  difficulty: TrailDifficulty;
}

export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty] ?? difficultyConfig.easy;

  return <span className={difficultyBadge({ difficulty: config.difficulty })}>{config.label}</span>;
}
