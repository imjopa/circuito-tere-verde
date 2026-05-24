import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import { useMemo } from "react";

import { parks } from "@/data/parks";
import { trails } from "@/data/trails";

const difficultyFilters = ["all", "easy", "medium", "hard"];
const parkFilters = ["all", ...parks.map((park) => park.id)];

export function useTrailFilters() {
  const [searchQuery, setSearchQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [activeDifficulty, setActiveDifficulty] = useQueryState(
    "difficulty",
    parseAsStringEnum(difficultyFilters).withDefault("all"),
  );
  const [activePark, setActivePark] = useQueryState(
    "park",
    parseAsStringEnum(parkFilters).withDefault("all"),
  );

  const filteredTrails = useMemo(() => {
    return trails.filter((trail) => {
      const matchesSearch =
        trail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trail.parkName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty = activeDifficulty === "all" || trail.difficulty === activeDifficulty;

      const matchesPark = activePark === "all" || trail.parkId === activePark;

      return matchesSearch && matchesDifficulty && matchesPark;
    });
  }, [searchQuery, activeDifficulty, activePark]);

  return {
    searchQuery,
    setSearchQuery,
    activeDifficulty,
    setActiveDifficulty,
    activePark,
    setActivePark,
    filteredTrails,
  };
}
