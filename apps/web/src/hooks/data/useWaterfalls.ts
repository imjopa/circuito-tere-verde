import type { Park, Waterfall } from "@circuito/db/client";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

const accessFilters = ["easy", "medium", "hard"];

export function useWaterfalls() {
  const [searchParams] = useWaterfallFilters();

  return useQuery({
    queryKey: ["waterfalls", searchParams],
    queryFn: () =>
      ky.get("/api/waterfalls", { searchParams }).json<(Waterfall & { park: Park })[]>(),
  });
}

export function useWaterfallFilters() {
  return useQueryStates({
    q: parseAsString.withDefault(""),
    access: parseAsStringEnum(accessFilters).withDefault(""),
    park: parseAsString.withDefault(""),
  });
}
