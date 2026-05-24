import { cn } from "tailwind-variants";

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={cn("text-sm font-medium text-gray-600", className)} {...props} />;
}
