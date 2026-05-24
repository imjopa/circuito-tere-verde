import { tv } from "tailwind-variants";

export const sidebarItem = tv({
  base: "flex size-11 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-xl transition hover:bg-white/10",
  variants: {
    active: {
      true: "bg-white/[0.18] opacity-100 hover:opacity-100",
      false: "opacity-55 hover:opacity-90",
    },
  },
  defaultVariants: { active: false },
});

export const eventStatusPill = tv({
  base: "shrink-0 self-start rounded-full px-2.5 py-0.5 text-[0.6875rem] font-medium whitespace-nowrap",
  variants: {
    status: {
      open: "bg-green-100 text-green-900",
      few_spots: "bg-orange-100 text-orange-900",
      full: "bg-red-100 text-red-900",
      cancelled: "bg-gray-100 text-gray-500",
    },
  },
});
