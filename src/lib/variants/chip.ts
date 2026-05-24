import { tv } from "tailwind-variants";

export const filterChip = tv({
  base: "cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors",
  variants: {
    active: {
      true: "bg-green-400 font-medium text-green-900",
      false:
        "border border-gray-200 bg-white text-gray-500 hover:border-green-300 hover:text-green-700",
    },
  },
  defaultVariants: { active: false },
});
