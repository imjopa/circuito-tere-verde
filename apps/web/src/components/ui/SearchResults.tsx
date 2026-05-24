import type { Park, Trail, Waterfall } from "@circuito/db/client";
import { Droplets, Footprints, Trees } from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

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

export default function SearchResults({ results, isLoading = false, onClose }: SearchResultsProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <output
        className="absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-hidden overflow-y-auto rounded-lg border border-gray-100 bg-white shadow-lg"
        aria-live="polite"
      >
        <p className="p-5 text-center text-sm text-gray-500">Buscando...</p>
      </output>
    );
  }

  if (!results || results.total === 0) {
    return (
      <output
        className="absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-hidden overflow-y-auto rounded-lg border border-gray-100 bg-white shadow-lg"
        aria-live="polite"
      >
        <p className="p-5 text-center text-sm text-gray-500">Nenhum resultado encontrado.</p>
      </output>
    );
  }

  const handleTrailClick = useCallback(() => {
    onClose();
    return navigate("/trilhas");
  }, [onClose, navigate]);

  const handleWaterfallClick = useCallback(() => {
    onClose();
    return navigate("/cachoeiras");
  }, [onClose, navigate]);

  return (
    <output
      className="absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-hidden overflow-y-auto rounded-lg border border-gray-100 bg-white shadow-lg"
      aria-label="Resultados da busca"
    >
      {results.parks.length > 0 && (
        <div className="border-b border-gray-100 last:border-b-0">
          <span className="block px-4 pt-2.5 pb-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
            Parques
          </span>
          {results.parks.map((park) => (
            <button
              key={park.id}
              className="flex w-full cursor-pointer items-center gap-3 border-none bg-transparent px-4 py-2.5 text-left transition hover:bg-green-50"
              onClick={onClose}
              aria-selected={false}
              // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
              role="option"
            >
              <Trees className="size-5 shrink-0 text-green-700" aria-hidden />
              <div>
                <p className="text-sm font-medium text-gray-900">{park.name}</p>
                <p className="mt-px text-xs text-gray-500">{park.type}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {results.trails.length > 0 && (
        <div className="border-b border-gray-100 last:border-b-0">
          <span className="block px-4 pt-2.5 pb-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
            Trilhas
          </span>
          {results.trails.map((trail) => (
            <button
              key={trail.id}
              className="flex w-full cursor-pointer items-center gap-3 border-none bg-transparent px-4 py-2.5 text-left transition hover:bg-green-50"
              onClick={handleTrailClick}
              aria-selected={false}
              // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
              role="option"
            >
              <Footprints className="size-5 shrink-0 text-green-700" aria-hidden />
              <div>
                <p className="text-sm font-medium text-gray-900">{trail.name}</p>
                <p className="mt-px text-xs text-gray-500">
                  {trail.parkName} · {trail.difficulty}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {results.waterfalls.length > 0 && (
        <div className="border-b border-gray-100 last:border-b-0">
          <span className="block px-4 pt-2.5 pb-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
            Cachoeiras
          </span>
          {results.waterfalls.map((wf) => (
            <button
              key={wf.id}
              className="flex w-full cursor-pointer items-center gap-3 border-none bg-transparent px-4 py-2.5 text-left transition hover:bg-green-50"
              onClick={handleWaterfallClick}
              aria-selected={false}
              // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
              role="option"
            >
              <Droplets className="size-5 shrink-0 text-green-700" aria-hidden />
              <div>
                <p className="text-sm font-medium text-gray-900">{wf.name}</p>
                <p className="mt-px text-xs text-gray-500">
                  {wf.parkName} · {wf.access}
                </p>
              </div>
            </button>
          ))}
        </div>
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
