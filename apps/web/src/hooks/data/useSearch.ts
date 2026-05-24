import type { Park, Trail, Waterfall } from "@circuito/db/client";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { parseAsString, useQueryStates } from "nuqs";

export interface SearchResponse {
  parks: Park[];
  trails: Trail[];
  waterfalls: Waterfall[];
  total: number;
}

export function useSearch() {
  const [searchParams] = useSearchFilters();

  return useQuery({
    queryKey: ["search", searchParams],
    queryFn: () => ky.get("/api/search", { searchParams }).json<SearchResponse>(),
    enabled: searchParams.q.length >= 2,
  });
}

export function useSearchFilters() {
  return useQueryStates({
    q: parseAsString.withDefault(""),
  });
}
