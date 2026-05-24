import { useState, useMemo } from "react";
import { trails } from "@/data/trails";

export function useTrailFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const [activePark, setActivePark] = useState("all");

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
