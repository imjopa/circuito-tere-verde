import type { Park, Trail } from "@circuito/db/client";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

const difficultyFilters = ["easy", "medium", "hard"];

export function useTrails() {
  const [searchParams] = useTrailFilters();

  return useQuery({
    queryKey: ["trails", searchParams],
    queryFn: () => ky.get("/api/trails", { searchParams }).json<(Trail & { park: Park })[]>(),
  });
}

export function useTrailFilters() {
  return useQueryStates({
    q: parseAsString.withDefault(""),
    difficulty: parseAsStringEnum(difficultyFilters).withDefault(""),
    park: parseAsString.withDefault(""),
  });
}
