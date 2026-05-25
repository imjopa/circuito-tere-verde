import type { Park, Trail, Waterfall } from "@circuito/db/client";
import { Droplets, Footprints, Trees } from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { SearchResultItem, SearchResultSection } from "@/components/ui/SearchResultSection";

export interface SearchResultsProps {
  results: {
    parks: Park[];
    trails: Trail[];
    waterfalls: Waterfall[];
    total: number;
  };
  isLoading?: boolean;
  onClose: () => void;
}

const dropdownClass =
  "absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-hidden overflow-y-auto rounded-lg border border-gray-100 bg-white shadow-lg";

export default function SearchResults({ results, isLoading = false, onClose }: SearchResultsProps) {
  const navigate = useNavigate();

  const handleTrailClick = useCallback(() => {
    onClose();
    return navigate("/trilhas");
  }, [onClose, navigate]);

  const handleWaterfallClick = useCallback(() => {
    onClose();
    return navigate("/cachoeiras");
  }, [onClose, navigate]);

  if (isLoading) {
    return (
      <output className={dropdownClass} aria-live="polite">
        <p className="p-5 text-center text-sm text-gray-500">Buscando...</p>
      </output>
    );
  }

  if (!results || results.total === 0) {
    return (
      <output className={dropdownClass} aria-live="polite">
        <p className="p-5 text-center text-sm text-gray-500">Nenhum resultado encontrado.</p>
      </output>
    );
  }

  return (
    <output className={dropdownClass} aria-label="Resultados da busca">
      {results.parks.length > 0 && (
        <SearchResultSection label="Parques">
          {results.parks.map((park) => (
            <SearchResultItem
              key={park.id}
              icon={Trees}
              title={park.name}
              subtitle={park.type}
              onClick={onClose}
            />
          ))}
        </SearchResultSection>
      )}

      {results.trails.length > 0 && (
        <SearchResultSection label="Trilhas">
          {results.trails.map((trail) => (
            <SearchResultItem
              key={trail.id}
              icon={Footprints}
              title={trail.name}
              subtitle={`${trail.parkName} · ${trail.difficulty}`}
              onClick={handleTrailClick}
            />
          ))}
        </SearchResultSection>
      )}

      {results.waterfalls.length > 0 && (
        <SearchResultSection label="Cachoeiras">
          {results.waterfalls.map((wf) => (
            <SearchResultItem
              key={wf.id}
              icon={Droplets}
              title={wf.name}
              subtitle={`${wf.parkName} · ${wf.access}`}
              onClick={handleWaterfallClick}
            />
          ))}
        </SearchResultSection>
      )}

      <div className="bg-gray-50 px-4 py-2 text-center text-xs text-gray-500">
        <span>
          {results.total} resultado{results.total !== 1 ? "s" : ""} encontrado
          {results.total !== 1 ? "s" : ""}
        </span>
      </div>
    </output>
  );
}
