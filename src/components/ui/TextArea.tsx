import { tv, type VariantProps } from "tailwind-variants";

export const variants = tv({
  base: "min-h-30 resize-y w-full rounded-lg border px-3 py-2 text-sm outline-none transition",
  variants: {
    error: {
      true: "border-red-400 ring-1 ring-red-400",
      false: "border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600",
    },
  },
  defaultVariants: { error: false },
});

export type TextAreaProps = React.ComponentProps<"textarea"> & VariantProps<typeof variants>;

export function TextArea({ error, className, ...props }: TextAreaProps) {
  return <textarea className={variants({ error, className })} {...props} />;
}
