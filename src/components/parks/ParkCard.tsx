import { tv } from "tailwind-variants";

import type { Park } from "@/data/parks";

const variants = tv({
  base: "rounded-lg border border-t-4 border-gray-100 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md",
  variants: {
    park: {
      "serra-dos-orgaos": "border-green-900",
      "tres-picos": "border-green-800",
      "montanhas-teresopolis": "border-green-700",
    },
  },
});

export interface ParkCardProps {
  park: Park;
}

export default function ParkCard({ park }: ParkCardProps) {
  return (
    <article className={variants({ park: park.id })}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">
          {park.type}
        </span>
        <span
          className="size-2 rounded-full bg-green-400"
          title={park.status === "open" ? "Aberto" : "Fechado"}
        />
      </div>

      <h3 className="mb-2 text-lg text-green-800">{park.name}</h3>
      <p className="mb-4 text-xs leading-relaxed text-gray-500">{park.description}</p>

      <ul className="mb-4 flex list-none flex-col gap-1.5 rounded-md bg-green-50 p-3">
        <li className="flex justify-between text-xs">
          <span className="text-gray-500">Área</span>
          <span>{park.area}</span>
        </li>
        <li className="flex justify-between text-xs">
          <span className="text-gray-500">Altitude máx.</span>
          <span>{park.altitude}</span>
        </li>
        <li className="flex justify-between text-xs">
          <span className="text-gray-500">Horários</span>
          <span>{park.openingHours}</span>
        </li>
        <li className="flex justify-between text-xs">
          <span className="text-gray-500">Entrada</span>
          <span>{park.entranceFee}</span>
        </li>
      </ul>

      <div className="flex flex-wrap gap-1.5">
        {park.biodiversity.map((item) => (
          <span
            key={item}
            className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs text-green-800"
          >
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}
