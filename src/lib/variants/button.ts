import { tv } from "tailwind-variants";

export const btnPrimary = tv({
  base: "inline-block rounded-full bg-green-400 px-6 py-2.5 text-sm font-medium text-green-900 transition hover:bg-green-300",
});

export const btnOutline = tv({
  base: "inline-block rounded-full border border-white/40 px-6 py-2.5 text-sm text-white transition hover:border-white/75",
});
