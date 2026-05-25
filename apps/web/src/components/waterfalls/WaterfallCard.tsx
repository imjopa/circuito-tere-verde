import type { Park, Waterfall } from "@circuito/db/client";
import { ArrowUp, Droplets, Trees } from "lucide-react";
import { tv } from "tailwind-variants";

import { DetailSection } from "@/components/ui/DetailSection";
import { waterfallAccessLabels } from "@/lib/constants/labels";

export interface WaterfallCardProps {
  waterfall: Waterfall & { park: Park };
}

const variants = tv({
  slots: {
    header: "relative px-5 pt-5 pb-3",
    accessLabel: "rounded-full px-2.5 py-0.5 text-xs font-medium",
  },
  variants: {
    access: {
      easy: {
        accessLabel: "bg-green-100 text-green-900",
      },
      medium: {
        accessLabel: "bg-yellow-100 text-yellow-900",
      },
      hard: {
        accessLabel: "bg-red-100 text-red-900",
      },
    },
    park: {
      "serra-dos-orgaos": {
        header: "bg-linear-to-br from-green-900 to-green-800",
      },
      "tres-picos": {
        header: "bg-linear-to-br from-green-800 to-green-700",
      },
      "montanhas-teresopolis": {
        header: "bg-linear-to-br from-green-700 to-green-600",
      },
    } as Record<string, { header: string }>,
  },
  defaultVariants: {
    park: "serra-dos-orgaos",
    access: "easy",
  },
});

export function WaterfallCard({ waterfall }: WaterfallCardProps) {
  const { header, accessLabel } = variants({ park: waterfall.park.slug, access: waterfall.access });

  return (
    <article className="overflow-hidden rounded-lg border border-gray-100 bg-white transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={header()}>
        <div className="mb-3 flex flex-wrap gap-1.5">
          <span className={accessLabel()}>{waterfallAccessLabels[waterfall.access]}</span>
          {waterfall.allowsBathing && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs text-white">
              <Droplets className="size-3.5" aria-hidden />
              Permite banho
            </span>
          )}
        </div>
        <h2 className="text-lg text-white">{waterfall.name}</h2>
        <p className="mt-0.5 text-xs text-white/70">{waterfall.parkName}</p>
      </div>

      <div className="flex flex-col gap-3.5 px-5 py-4">
        <div className="flex gap-4">
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <ArrowUp className="size-3.5 shrink-0" aria-hidden />
            {waterfall.heightMeters} m
          </span>
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Trees className="size-3.5 shrink-0" aria-hidden />
            {waterfall.parkName}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-gray-600">{waterfall.description}</p>

        <DetailSection title="Como chegar">{waterfall.howToGet}</DetailSection>
        <DetailSection title="Acessibilidade">{waterfall.accessibility}</DetailSection>

        <DetailSection title="Dicas" list>
          {waterfall.tips.map((tip) => (
            <li key={tip} className="text-sm text-gray-600">
              • {tip}
            </li>
          ))}
        </DetailSection>
      </div>
    </article>
  );
}
