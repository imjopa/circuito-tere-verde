import type { LucideIcon } from "lucide-react";

export interface SearchResultItemProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
}

export function SearchResultItem({ icon: Icon, title, subtitle, onClick }: SearchResultItemProps) {
  return (
    <button
      className="flex w-full cursor-pointer items-center gap-3 border-none bg-transparent px-4 py-2.5 text-left transition hover:bg-green-50"
      onClick={onClick}
      aria-selected={false}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="option"
    >
      <Icon className="size-5 shrink-0 text-green-700" aria-hidden />
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="mt-px text-xs text-gray-500">{subtitle}</p>
      </div>
    </button>
  );
}

export interface SearchResultSectionProps {
  label: string;
  children: React.ReactNode;
}

export function SearchResultSection({ label, children }: SearchResultSectionProps) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <span className="block px-4 pt-2.5 pb-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}
