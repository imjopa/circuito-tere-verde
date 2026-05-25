import { X } from "lucide-react";

export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  ariaLabel?: string;
  variant?: "default" | "danger";
}

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  ariaLabel,
  variant = "default",
}: ModalProps) {
  if (!open) return null;

  const panelClass =
    variant === "danger"
      ? "flex w-full max-w-md flex-col gap-4 rounded-xl border-t-4 border-red-400 bg-white p-7 shadow-lg"
      : "flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-7 shadow-lg";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      aria-modal="true"
      aria-label={ariaLabel ?? title}
      // cannot be a native dialog
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="dialog"
    >
      <div className={panelClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-green-800">{title}</h2>
          <button
            type="button"
            className="flex size-7 cursor-pointer items-center justify-center rounded-full border-none bg-gray-100 text-sm text-gray-500 transition hover:bg-gray-200"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        {children}
        {footer}
      </div>
    </div>
  );
}

export interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmDialog({
  open,
  title = "Confirmar exclusão",
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Sim, excluir",
  cancelLabel = "Cancelar",
}: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel} variant="danger" ariaLabel={title}>
      {message}
      <div className="mt-1 flex justify-end gap-3">
        <button
          type="button"
          className="cursor-pointer rounded-md border-none bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
          onClick={onCancel}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-md border-none bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export interface ModalFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
}

export function ModalFooter({
  onCancel,
  onConfirm,
  cancelLabel = "Cancelar",
  confirmLabel = "Salvar alterações",
}: ModalFooterProps) {
  return (
    <div className="mt-1 flex justify-end gap-3">
      <button
        type="button"
        className="cursor-pointer rounded-md border-none bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
        onClick={onCancel}
      >
        {cancelLabel}
      </button>
      <button
        type="button"
        className="cursor-pointer rounded-md border-none bg-green-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-800"
        onClick={onConfirm}
      >
        {confirmLabel}
      </button>
    </div>
  );
}
