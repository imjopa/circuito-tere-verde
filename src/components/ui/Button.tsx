import { tv, type VariantProps } from "tailwind-variants";

export const variants = tv({
  base: "inline-block rounded-full bg-green-400 px-6 py-2.5 text-sm font-medium text-green-900 transition hover:bg-green-300",
  variants: {
    variant: {
      outline:
        "border border-white/40 px-6 py-2.5 text-sm text-white transition hover:border-white/75",
    },
  },
});

export type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof variants>;

export function Button({ variant, className, ...props }: ButtonProps) {
  return <button type="button" className={variants({ variant, className })} {...props} />;
}
