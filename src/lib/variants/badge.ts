import { tv } from "tailwind-variants";

export const difficultyBadge = tv({
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

export const statusBadge = tv({
  base: "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[0.6875rem] font-medium",
  variants: {
    status: {
      open: "bg-green-100 text-green-900",
      closed: "bg-red-100 text-red-900",
      maintenance: "bg-yellow-100 text-yellow-900",
      climate_risk: "bg-orange-100 text-orange-900",
      full: "bg-blue-100 text-blue-900",
      cancelled: "bg-gray-100 text-gray-700",
      few_spots: "bg-amber-100 text-amber-900",
    },
  },
  defaultVariants: { status: "open" },
});

export const accessBadge = tv({
  base: "rounded-full px-2.5 py-0.5 text-xs font-medium",
  variants: {
    access: {
      easy: "bg-green-100 text-green-900",
      moderate: "bg-yellow-100 text-yellow-900",
      difficult: "bg-red-100 text-red-900",
    },
  },
  defaultVariants: { access: "easy" },
});
