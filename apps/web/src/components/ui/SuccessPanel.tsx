import { CircleCheck } from "lucide-react";

export interface SuccessPanelProps {
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  onReset: () => void;
  resetLabel?: string;
  className?: string;
}

export function SuccessPanel({
  title,
  description,
  children,
  onReset,
  resetLabel = "Enviar novamente",
  className,
}: SuccessPanelProps) {
  return (
    <div
      className={
        className ??
        "mx-auto flex max-w-lg flex-col items-center gap-3 rounded-xl border border-gray-100 bg-white p-10 text-center"
      }
    >
      <CircleCheck className="size-14 text-green-600" aria-hidden />
      <h2 className="text-2xl text-green-800">{title}</h2>
      {description && <p className="text-sm text-gray-500">{description}</p>}
      {children}
      <button
        type="button"
        onClick={onReset}
        className="mt-2 rounded-lg bg-green-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-green-800"
      >
        {resetLabel}
      </button>
    </div>
  );
}
