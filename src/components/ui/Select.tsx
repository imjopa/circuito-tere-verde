import { tv, type VariantProps } from "tailwind-variants";

const variants = tv({
  base: "w-full rounded-lg border px-3 py-2 text-sm outline-none transition",
  variants: {
    error: {
      true: "border-red-400 ring-1 ring-red-400",
      false: "border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600",
    },
  },
  defaultVariants: { error: false },
});

export type SelectProps = React.ComponentProps<"select"> & VariantProps<typeof variants>;

export function Select({ error, className, ...props }: SelectProps) {
  return <select className={variants({ error, className })} {...props} />;
}
