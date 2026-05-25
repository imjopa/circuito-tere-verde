import { Search, X } from "lucide-react";
import { tv, type VariantProps } from "tailwind-variants";

const searchBar = tv({
  base: "flex items-center gap-3 rounded-full border border-gray-100 bg-white px-4 py-2.5",
  variants: {
    variant: {
      hero: "shadow-lg",
      inline: "shadow-sm",
    },
  },
  defaultVariants: { variant: "inline" },
});

const inputClass = tv({
  base: "font-body flex-1 border-none bg-transparent text-sm outline-none",
  variants: {
    variant: {
      hero: "text-gray-700 [&::-webkit-search-cancel-button]:hidden",
      inline: "",
    },
  },
  defaultVariants: { variant: "inline" },
});

export interface SearchBarProps extends VariantProps<typeof searchBar> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder: string;
  ariaLabel: string;
  onFocus?: () => void;
  ariaExpanded?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder,
  ariaLabel,
  variant = "inline",
  onFocus,
  ariaExpanded,
  className,
  children,
}: SearchBarProps) {
  const inputType = variant === "hero" ? "search" : "text";

  return (
    <div className={`relative ${className ?? ""}`}>
      <search className={searchBar({ variant })} aria-expanded={ariaExpanded}>
        <Search className="size-5 shrink-0 text-gray-400" aria-hidden />
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          className={inputClass({ variant })}
          aria-label={ariaLabel}
          aria-autocomplete={variant === "hero" ? "list" : undefined}
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-gray-100 text-xs text-gray-500"
            aria-label="Limpar busca"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        )}
      </search>
      {children}
    </div>
  );
}
