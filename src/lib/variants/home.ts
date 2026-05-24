import { tv } from "tailwind-variants";

export const homePage = tv({
  slots: {
    page: "flex min-h-screen flex-col",
    hero: "relative overflow-hidden bg-green-700 px-6 pb-20 pt-16",
    heroContent: "mx-auto max-w-[600px]",
    heroTag:
      "mb-4 inline-block rounded-full bg-green-400 px-3 py-1 text-xs font-medium text-green-900",
    heroTitle: "mb-4 text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-white",
    heroSubtitle: "mb-7 text-base leading-relaxed text-white/75",
    heroBtns: "flex flex-wrap gap-4",
    heroDecoration:
      "pointer-events-none absolute -top-[60px] -right-[60px] size-[280px] rounded-full bg-green-400/10",
    searchWrapper: "relative z-20 mx-auto -mt-6 max-w-[680px] px-6",
    searchBar:
      "flex items-center gap-3 rounded-full border border-gray-100 bg-white px-4 py-2.5 shadow-lg",
    searchInput:
      "flex-1 border-none bg-transparent font-body text-[0.9375rem] text-gray-700 outline-none [&::-webkit-search-cancel-button]:hidden",
    clearBtn:
      "flex size-[22px] shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-gray-100 text-xs text-gray-500",
    main: "mx-auto w-full max-w-[1200px] flex-1 px-6 py-12",
    section: "mb-14",
    sectionHeader: "mb-6 flex flex-wrap items-end justify-between gap-2",
    sectionTitle: "mb-1.5 text-[1.375rem] text-green-800",
    sectionSubtitle: "mb-6 text-sm text-gray-500",
    sectionTitleInHeader: "mb-1 text-[1.375rem] text-green-800",
    sectionSubtitleInHeader: "text-sm text-gray-500",
    seeAllLink:
      "whitespace-nowrap text-sm font-medium text-green-600 transition hover:text-green-700",
    parksGrid: "grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5",
    quickAccess: "grid grid-cols-[repeat(auto-fit,minmax(90px,1fr))] gap-3",
    qaItem:
      "flex flex-col items-center gap-2 rounded-md border border-gray-100 bg-white px-3 py-4 transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-sm",
    qaIcon: "text-2xl",
    qaLabel: "text-center text-[0.8125rem] text-gray-500",
    eventsList: "flex flex-col gap-3",
    eventItem:
      "flex items-center gap-4 rounded-md border border-gray-100 bg-white px-5 py-4 transition hover:shadow-sm",
    eventDate: "min-w-[44px] shrink-0 rounded-md bg-green-700 px-3 py-1.5 text-center text-white",
    eventDay: "block text-lg font-semibold leading-tight",
    eventMonth: "text-[0.625rem] uppercase opacity-80",
    eventInfo: "min-w-0 flex-1",
    eventTitle: "text-[0.9375rem] font-medium text-gray-900",
    eventPark: "mt-0.5 text-[0.8125rem] text-gray-500",
    eventTag:
      "shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs whitespace-nowrap text-green-800",
    footer: "flex flex-col gap-1 bg-green-800 px-6 py-6 text-center text-[0.8125rem] text-white/60",
    footerSub: "text-xs opacity-70",
  },
});
