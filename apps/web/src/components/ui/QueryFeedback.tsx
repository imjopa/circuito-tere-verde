import { tv, type VariantProps } from "tailwind-variants";

import { Button } from "@/components/ui/Button";

const loadingMessageVariants = tv({
  base: "text-sm text-gray-500",
  variants: {
    page: {
      true: "px-4 py-16 text-center",
      false: null,
    },
  },
  defaultVariants: {
    page: false,
  },
});

export type LoadingMessageProps = React.ComponentProps<"p"> &
  VariantProps<typeof loadingMessageVariants>;

export function LoadingMessage({ page, className, ...props }: LoadingMessageProps) {
  return <p className={loadingMessageVariants({ page, className })} {...props} />;
}

export interface QueryErrorStateProps {
  children: React.ReactNode;
  onRetry?: () => void;
  className?: string;
}

export function QueryErrorState({ children, onRetry, className }: QueryErrorStateProps) {
  return (
    <div className={className ?? "px-4 py-16 text-center"}>
      <p className="mb-4 text-sm text-gray-500">{children}</p>
      {onRetry && <Button onClick={onRetry}>Tentar novamente</Button>}
    </div>
  );
}
