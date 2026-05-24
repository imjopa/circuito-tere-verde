import { tv, type VariantProps } from "tailwind-variants";

export const buttonVariants = tv({
  base: "inline-block rounded-full px-6 py-2.5 text-sm transition",
  variants: {
    variant: {
      solid: "bg-green-400 font-medium text-green-900 hover:bg-green-300",
      outline: "border border-white/40 text-white hover:border-white/75",
    },
  },
  defaultVariants: {
    variant: "solid",
  },
});

export type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export function Button({ variant, className, ...props }: ButtonProps) {
  return <button type="button" className={buttonVariants({ variant, className })} {...props} />;
}
