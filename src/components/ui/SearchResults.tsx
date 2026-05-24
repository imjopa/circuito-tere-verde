import { Droplets, Footprints, Trees } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { tv } from "tailwind-variants";
import type { Trail } from "../../data/trails";
import type { Waterfall } from "../../data/waterfalls";
import type { Park } from "../../data/parks";

const searchResults = tv({
  slots: {
    dropdown:
      "absolute top-[calc(100%+8px)] right-0 left-0 z-50 max-h-[360px] overflow-hidden overflow-y-auto rounded-lg border border-gray-100 bg-white shadow-lg",
    empty: "p-5 text-center text-sm text-gray-500",
    group: "border-b border-gray-100 last:border-b-0",
    groupLabel:
      "block px-4 pt-2.5 pb-1 text-[0.6875rem] font-medium tracking-wider text-gray-500 uppercase",
    resultItem:
      "flex w-full cursor-pointer items-center gap-3 border-none bg-transparent px-4 py-2.5 text-left transition hover:bg-green-50",
    resultIcon: "size-5 shrink-0 text-green-700",
    resultName: "text-sm font-medium text-gray-900",
    resultMeta: "mt-px text-xs text-gray-500",
    footer: "bg-gray-50 px-4 py-2 text-center text-[0.6875rem] text-gray-500",
  },
});

export interface SearchResultsProps {
  results: {
    parks: Park[];
    trails: Trail[];
    waterfalls: Waterfall[];
    total: number;
  };
  onClose: () => void;
}

export default function SearchResults({ results, onClose }: SearchResultsProps) {
  const navigate = useNavigate();
  const styles = searchResults();

  if (!results || results.total === 0) {
    return (
      <div className={styles.dropdown()} role="status" aria-live="polite">
        <p className={styles.empty()}>Nenhum resultado encontrado.</p>
      </div>
    );
  }

  const handleTrailClick = () => {
    onClose();
    navigate("/trilhas");
  };

  const handleWaterfallClick = () => {
    onClose();
    navigate("/cachoeiras");
  };

  return (
    <div className={styles.dropdown()} role="listbox" aria-label="Resultados da busca">
      {results.parks.length > 0 && (
        <div className={styles.group()}>
          <span className={styles.groupLabel()}>Parques</span>
          {results.parks.map((park) => (
            <button key={park.id} className={styles.resultItem()} onClick={onClose} role="option">
              <Trees className={styles.resultIcon()} aria-hidden />
              <div>
                <p className={styles.resultName()}>{park.name}</p>
                <p className={styles.resultMeta()}>{park.type}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {results.trails.length > 0 && (
        <div className={styles.group()}>
          <span className={styles.groupLabel()}>Trilhas</span>
          {results.trails.map((trail) => (
            <button
              key={trail.id}
              className={styles.resultItem()}
              onClick={handleTrailClick}
              role="option"
            >
              <Footprints className={styles.resultIcon()} aria-hidden />
              <div>
                <p className={styles.resultName()}>{trail.name}</p>
                <p className={styles.resultMeta()}>
                  {trail.parkName} · {trail.difficulty}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {results.waterfalls.length > 0 && (
        <div className={styles.group()}>
          <span className={styles.groupLabel()}>Cachoeiras</span>
          {results.waterfalls.map((wf) => (
            <button
              key={wf.id}
              className={styles.resultItem()}
              onClick={handleWaterfallClick}
              role="option"
            >
              <Droplets className={styles.resultIcon()} aria-hidden />
              <div>
                <p className={styles.resultName()}>{wf.name}</p>
                <p className={styles.resultMeta()}>
                  {wf.parkName} · {wf.access}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className={styles.footer()}>
        <span>
          {results.total} resultado{results.total !== 1 ? "s" : ""} encontrado
          {results.total !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
