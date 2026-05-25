import type { ParkStatus } from "@circuito/db/client";
import { tv } from "tailwind-variants";

import { parkStatusLabels } from "@/lib/constants/labels";

const variants = tv({
  base: "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
  variants: {
    status: {
      open: "bg-green-100 text-green-900",
      closed: "bg-red-100 text-red-900",
      maintenance: "bg-yellow-100 text-yellow-900",
    },
  },
});

export function ParkStatusBadge({ status }: { status: ParkStatus }) {
  return <span className={variants({ status })}>{parkStatusLabels[status]}</span>;
}
