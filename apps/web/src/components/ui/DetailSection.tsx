export interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  list?: boolean;
}

export function DetailSection({ title, children, list = false }: DetailSectionProps) {
  return (
    <div>
      <p
        className={`text-xs font-medium tracking-wider text-gray-500 uppercase ${list ? "mb-1" : "mb-0.5"}`}
      >
        {title}
      </p>
      {list ? (
        <ul className="flex list-none flex-col gap-0.5">{children}</ul>
      ) : (
        <p className="text-sm leading-normal text-gray-600">{children}</p>
      )}
    </div>
  );
}
