import { FilterChip } from "@/components/ui/FilterChip";

export interface FilterGroupProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  allLabel?: "Todas" | "Todos";
  className?: string;
}

export function FilterGroup({
  label,
  options,
  value,
  onChange,
  allLabel = "Todas",
  className = "mb-6 flex flex-wrap items-center gap-3",
}: FilterGroupProps) {
  return (
    <div className={className}>
      <span className="text-sm whitespace-nowrap text-gray-500">{label}:</span>
      <div className="flex flex-wrap gap-2">
        <FilterChip active={value === ""} onClick={() => onChange("")}>
          {allLabel}
        </FilterChip>
        {options.map((option) => (
          <FilterChip
            key={option.value}
            active={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </FilterChip>
        ))}
      </div>
    </div>
  );
}
