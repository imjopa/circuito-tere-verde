import { Pencil, Trash2 } from "lucide-react";

export interface AdminListCardProps {
  badge: React.ReactNode;
  title: string;
  meta: string;
  detail?: string;
  onEdit: () => void;
  onDelete?: () => void;
  disabled?: boolean;
  editLabel?: string;
  deleteLabel?: string;
}

export function AdminListCard({
  badge,
  title,
  meta,
  detail,
  onEdit,
  onDelete,
  disabled = false,
  editLabel = "Editar",
  deleteLabel = "Excluir",
}: AdminListCardProps) {
  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-lg border border-gray-100 bg-white px-5 py-4 transition hover:shadow-sm${
        disabled ? " opacity-55" : ""
      }`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3.5">
        {badge}
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 truncate text-sm font-medium text-gray-900">{title}</p>
          <p className="mb-1 text-sm text-gray-500">{meta}</p>
          {detail && (
            <p className="rounded-sm border-l-4 border-green-300 bg-gray-50 px-2 py-1 text-sm leading-normal text-gray-600">
              {detail}
            </p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 flex-col gap-2">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-green-800 transition hover:bg-green-100"
          onClick={onEdit}
          aria-label={`${editLabel} ${title}`}
        >
          <Pencil className="size-3.5" aria-hidden />
          {editLabel}
        </button>
        {onDelete && (
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-red-700 transition hover:bg-red-100"
            onClick={onDelete}
            aria-label={`${deleteLabel} ${title}`}
          >
            <Trash2 className="size-3.5" aria-hidden />
            {deleteLabel}
          </button>
        )}
      </div>
    </div>
  );
}
