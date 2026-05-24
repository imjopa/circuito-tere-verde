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

export const metricCard = tv({
  slots: {
    root: "rounded-lg border border-gray-100 bg-white px-5 py-4",
    label: "mb-1.5 text-xs leading-snug text-gray-500",
    value: "font-display text-3xl leading-none font-semibold text-green-800",
    delta:
      "mt-1.5 inline-block rounded-full bg-green-100 px-2 py-0.5 text-[0.6875rem] text-green-800",
  },
  variants: {
    alert: {
      true: {
        root: "border-red-300 bg-red-50",
        value: "text-red-700",
        delta: "bg-red-100 text-red-800",
      },
      false: {},
    },
  },
  defaultVariants: { alert: false },
});

export const manageCard = tv({
  slots: {
    root: "flex items-start justify-between gap-4 rounded-lg border border-gray-100 bg-white px-5 py-4 transition hover:shadow-sm",
    left: "flex min-w-0 flex-1 items-start gap-3.5",
    info: "min-w-0 flex-1",
    name: "mb-0.5 truncate text-[0.9375rem] font-medium text-gray-900",
    meta: "mb-1 text-[0.8125rem] text-gray-500",
    conditions:
      "rounded-sm border-l-[3px] border-green-300 bg-gray-50 px-2 py-1 text-[0.8125rem] leading-normal text-gray-600",
    actions: "flex shrink-0 flex-col gap-2",
  },
  variants: {
    cancelled: {
      true: { root: "opacity-55" },
      false: {},
    },
  },
  defaultVariants: { cancelled: false },
});

export const adminModal = tv({
  slots: {
    overlay: "fixed inset-0 z-[200] flex items-center justify-center bg-black/45 p-4",
    panel: "flex w-full max-w-[440px] flex-col gap-4 rounded-xl bg-white p-7 shadow-lg",
    header: "flex items-center justify-between",
    title: "text-lg font-semibold text-green-800",
    close:
      "flex size-7 cursor-pointer items-center justify-center rounded-full border-none bg-gray-100 text-sm text-gray-500 transition hover:bg-gray-200",
    subject: "text-[0.9375rem] font-medium text-gray-900",
    meta: "-mt-1.5 text-[0.8125rem] text-gray-500",
    field: "flex flex-col gap-[5px]",
    label: "text-[0.8125rem] font-medium text-gray-600",
    preview: "mt-1 flex items-center gap-2",
    previewLabel: "text-xs text-gray-500",
    hint: "mt-0.5 text-xs text-gray-500",
    actions: "mt-1 flex justify-end gap-3",
    cancelBtn:
      "cursor-pointer rounded-md border-none bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200",
    saveBtn:
      "cursor-pointer rounded-md border-none bg-green-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-800",
    deleteConfirmBtn:
      "cursor-pointer rounded-md border-none bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700",
    deleteWarning:
      "rounded-md border border-red-200 bg-red-50 px-4 py-3.5 text-[0.9375rem] leading-relaxed text-gray-700",
    deleteNote: "text-[0.8125rem] leading-normal text-gray-500 italic",
  },
  variants: {
    danger: {
      true: { panel: "border-t-4 border-red-400" },
      false: {},
    },
  },
  defaultVariants: { danger: false },
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

export const actionEditBtn = tv({
  base: "cursor-pointer rounded-md border border-green-200 bg-green-50 px-3.5 py-1.5 text-[0.8125rem] font-medium whitespace-nowrap text-green-800 transition hover:bg-green-100",
});

export const actionDeleteBtn = tv({
  base: "cursor-pointer rounded-md border border-red-200 bg-red-50 px-3.5 py-1.5 text-[0.8125rem] font-medium whitespace-nowrap text-red-700 transition hover:bg-red-100",
});
