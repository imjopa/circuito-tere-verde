import { Link as RouterLink, type LinkProps as RouterLinkProps } from "react-router-dom";
import { type VariantProps } from "tailwind-variants";
import { buttonVariants } from "./Button";

export type LinkProps = RouterLinkProps & VariantProps<typeof buttonVariants>;

export function Link({ variant, className, ...props }: LinkProps) {
  return <RouterLink className={buttonVariants({ variant, className })} {...props} />;
}
