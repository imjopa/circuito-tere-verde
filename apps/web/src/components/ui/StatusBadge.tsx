import { tv, type VariantProps } from "tailwind-variants";

const variants = tv({
  base: "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
  variants: {
    status: {
      open: "bg-green-100 text-green-900",
      closed: "bg-red-100 text-red-900",
      maintenance: "bg-yellow-100 text-yellow-900",
      climate_risk: "bg-orange-100 text-orange-900",
      full: "bg-blue-100 text-blue-900",
      cancelled: "bg-gray-100 text-gray-700",
      few_spots: "bg-amber-100 text-amber-900",
    },
  },
});

const statusLabel = {
  open: "Aberta",
  closed: "Fechada",
  maintenance: "Manutenção",
  climate_risk: "Risco Climático",
  full: "Lotada",
  cancelled: "Cancelada",
  few_spots: "Poucas Vagas",
};

export type StatusBadgeProps = VariantProps<typeof variants>;

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={variants({ status })}>{statusLabel[status ?? "open"]}</span>;
}
