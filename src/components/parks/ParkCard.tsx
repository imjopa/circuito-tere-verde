import type { Park } from "../../data/parks";

export interface ParkCardProps {
  park: Park;
}

export default function ParkCard({ park }: ParkCardProps) {
  return (
    <article
      className="rounded-lg border border-gray-100 border-t-4 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderTopColor: park.colorAccent }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[0.6875rem] font-medium tracking-wide text-gray-500 uppercase">
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
            className="rounded-full bg-green-100 px-2.5 py-0.5 text-[0.6875rem] text-green-800"
          >
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}
