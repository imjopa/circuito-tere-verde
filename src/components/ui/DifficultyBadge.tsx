import { tv, type VariantProps } from "tailwind-variants";

const difficultyLabel = {
  easy: "Fácil",
  medium: "Moderado",
  hard: "Difícil",
};

const variants = tv({
  base: "rounded-full px-3 py-1 text-xs font-medium",
  variants: {
    difficulty: {
      easy: "bg-green-100 text-green-900",
      medium: "bg-yellow-100 text-yellow-900",
      hard: "bg-red-100 text-red-900",
    },
  },
  defaultVariants: { difficulty: "easy" },
});

export type DifficultyBadgeProps = Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof variants>;

export default function DifficultyBadge({ difficulty, className, ...props }: DifficultyBadgeProps) {
  return (
    <span className={variants({ difficulty, className })} {...props}>
      {difficultyLabel[difficulty ?? "easy"]}
    </span>
  );
}
