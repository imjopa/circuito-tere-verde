import type { Park, ParkEvent } from "@circuito/db/client";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

const categoryFilters = ["guided_trail", "education", "volunteer", "workshop"];

export function useEvents() {
  const [searchParams] = useEventFilters();

  return useQuery({
    queryKey: ["events", searchParams],
    queryFn: () => ky.get("/api/events", { searchParams }).json<(ParkEvent & { park: Park })[]>(),
  });
}

export function useEventFilters() {
  return useQueryStates({
    q: parseAsString.withDefault(""),
    category: parseAsStringEnum(categoryFilters).withDefault(""),
    park: parseAsString.withDefault(""),
  });
}
