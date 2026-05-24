import { tv } from "tailwind-variants";

export const navLink = tv({
  base: "pb-0.5 text-sm text-white/75 transition hover:text-green-300",
  variants: {
    active: {
      true: "border-b-2 border-green-400 text-green-400",
      false: "",
    },
  },
});

export const mobileNavLink = tv({
  base: "border-b border-white/10 py-3 text-[0.9375rem] text-white/80 transition hover:text-green-400",
  variants: {
    active: {
      true: "text-green-400",
      false: "",
    },
  },
});
