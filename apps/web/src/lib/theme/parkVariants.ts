import { tv } from "tailwind-variants";

export const parkHeaderGradient = tv({
  base: "",
  variants: {
    park: {
      "serra-dos-orgaos": "bg-linear-to-br from-green-900 to-green-800",
      "tres-picos": "bg-linear-to-br from-green-800 to-green-700",
      "montanhas-teresopolis": "bg-linear-to-br from-green-700 to-green-600",
    } as Record<string, string>,
  },
  defaultVariants: {
    park: "serra-dos-orgaos",
  },
});

export const parkCardHeader = tv({
  base: "relative flex h-24 flex-col justify-end bg-green-700 p-3 px-4 [&>:first-child]:absolute [&>:first-child]:top-2.5 [&>:first-child]:right-3",
  variants: {
    park: {
      "serra-dos-orgaos": "bg-linear-to-br from-green-900 to-green-800",
      "tres-picos": "bg-linear-to-br from-green-800 to-green-700",
      "montanhas-teresopolis": "bg-linear-to-br from-green-700 to-green-600",
    } as Record<string, string>,
  },
  defaultVariants: {
    park: "serra-dos-orgaos",
  },
});

export const waterfallCardHeader = tv({
  base: "relative px-5 pt-5 pb-3",
  variants: {
    park: {
      "serra-dos-orgaos": "bg-linear-to-br from-green-900 to-green-800",
      "tres-picos": "bg-linear-to-br from-green-800 to-green-700",
      "montanhas-teresopolis": "bg-linear-to-br from-green-700 to-green-600",
    } as Record<string, string>,
  },
  defaultVariants: {
    park: "serra-dos-orgaos",
  },
});

export const accessLabelVariants = tv({
  base: "rounded-full px-2.5 py-0.5 text-xs font-medium",
  variants: {
    access: {
      easy: "bg-green-100 text-green-900",
      medium: "bg-yellow-100 text-yellow-900",
      hard: "bg-red-100 text-red-900",
    },
  },
  defaultVariants: { access: "easy" },
});
