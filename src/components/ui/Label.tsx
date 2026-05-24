import { cn } from "tailwind-variants";

interface LabelProps extends React.ComponentProps<"label"> {
  htmlFor: string;
}

export function Label({ htmlFor, className, ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("text-sm font-medium text-gray-600", className)}
      {...props}
    />
  );
}
