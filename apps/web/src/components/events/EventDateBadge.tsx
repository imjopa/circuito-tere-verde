import { formatEventDateParts } from "@/lib/format";

export interface EventDateBadgeProps {
  date: string;
  variant?: "sidebar" | "compact";
}

export function EventDateBadge({ date, variant = "sidebar" }: EventDateBadgeProps) {
  const { day, month, weekday } = formatEventDateParts(date);

  if (variant === "compact") {
    return (
      <div className="min-w-11 shrink-0 rounded-md bg-green-700 px-3 py-1.5 text-center text-white">
        <span className="block text-lg leading-tight font-semibold">{day}</span>
        <span className="text-xs uppercase opacity-80">{month}</span>
      </div>
    );
  }

  return (
    <div className="flex w-20 shrink-0 flex-col items-center justify-center gap-0.5 bg-green-700 px-4 py-5 text-white">
      <span className="font-display text-3xl leading-none font-bold">{day}</span>
      <span className="text-xs tracking-wider uppercase opacity-85">{month}</span>
      <span className="mt-0.5 text-center text-xs opacity-65">{weekday}</span>
    </div>
  );
}
