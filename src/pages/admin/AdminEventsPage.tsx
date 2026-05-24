import { AlertTriangle, Pencil, Trash2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { tv } from "tailwind-variants";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAdminData } from "@/contexts/AdminDataContext";
import { type ParkEvent, type ParkEventStatus } from "@/data/events";

const DEFAULT_EVENT_STATUS: ParkEventStatus = "open";

const EVENT_STATUS_OPTIONS = [
  { value: "open", label: "Vagas disponíveis" },
  { value: "few_spots", label: "Últimas vagas" },
  { value: "full", label: "Esgotado" },
  { value: "cancelled", label: "Cancelado" },
] as const;

const eventStatusPillVariants = tv({
  base: "shrink-0 self-start rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
  variants: {
    status: {
      open: "bg-green-100 text-green-900",
      few_spots: "bg-orange-100 text-orange-900",
      full: "bg-red-100 text-red-900",
      cancelled: "bg-gray-100 text-gray-500",
    },
  },
});

export default function AdminEventsPage() {
  const { eventsData, setEventsData } = useAdminData();

  const [editingEvent, setEditingEvent] = useState<ParkEvent | null>(null);
  const [eventStatusDraft, setEventStatusDraft] = useState<ParkEventStatus | null>(null);
  const [eventSpotsDraft, setEventSpotsDraft] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const saveEvent = useCallback(() => {
    if (!editingEvent) return;

    setEventsData((prev) =>
      prev.map((ev) =>
        ev.id === editingEvent.id
          ? {
              ...ev,
              status: eventStatusDraft ?? DEFAULT_EVENT_STATUS,
              spotsLeft: Number(eventSpotsDraft),
            }
          : ev,
      ),
    );
    setEditingEvent(null);
  }, [editingEvent, eventStatusDraft, eventSpotsDraft, setEventsData]);

  const executeDelete = useCallback(() => {
    if (!deleteTargetId) return;
    setEventsData((prev) => prev.filter((ev) => ev.id !== deleteTargetId));
    setDeleteTargetId(null);
  }, [deleteTargetId, setEventsData]);

  const handleCloseEdit = useCallback(() => {
    setEditingEvent(null);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setDeleteTargetId(null);
  }, []);

  const handleOpenEdit = useCallback((ev: ParkEvent) => {
    setEditingEvent(ev);
    setEventStatusDraft(ev.status);
    setEventSpotsDraft(String(ev.spotsLeft));
  }, []);

  const handleEventStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setEventStatusDraft(e.target.value as ParkEventStatus);
  }, []);

  const handleEventSpotsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEventSpotsDraft(e.target.value);
  }, []);

  return (
    <>
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{eventsData.length} eventos cadastrados</p>
        </div>
        <div className="flex flex-col gap-3">
          {eventsData.map((ev) => {
            const evDate = new Date(ev.date + "T00:00:00");
            const dateStr = evDate.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
            const handleEdit = useCallback(() => handleOpenEdit(ev), [ev]);
            const handleDelete = useCallback(() => setDeleteTargetId(ev.id), [ev.id]);
            return (
              <div
                key={ev.id}
                className={`flex items-start justify-between gap-4 rounded-lg border border-gray-100 bg-white px-5 py-4 transition hover:shadow-sm${
                  ev.status === "cancelled" ? " opacity-55" : ""
                }`}
              >
                <div className="flex min-w-0 flex-1 items-start gap-3.5">
                  <div className={eventStatusPillVariants({ status: ev.status })}>
                    {EVENT_STATUS_OPTIONS.find((o) => o.value === ev.status)?.label ?? ev.status}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-0.5 truncate text-sm font-medium text-gray-900">{ev.title}</p>
                    <p className="mb-1 text-sm text-gray-500">
                      {ev.park} · {dateStr} · {ev.time}
                    </p>
                    <p className="rounded-sm border-l-4 border-green-300 bg-gray-50 px-2 py-1 text-sm leading-normal text-gray-600">
                      {ev.spotsLeft} vagas restantes de {ev.spots} · {ev.price}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-green-800 transition hover:bg-green-100"
                    onClick={handleEdit}
                    aria-label={`Editar evento ${ev.title}`}
                  >
                    <Pencil className="size-3.5" aria-hidden />
                    Editar
                  </button>
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-red-700 transition hover:bg-red-100"
                    onClick={handleDelete}
                    aria-label={`Excluir evento ${ev.title}`}
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {editingEvent && (
        <dialog
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          aria-modal="true"
          aria-label="Editar evento"
          open
        >
          <div className="flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-7 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-green-800">Editar evento</h2>
              <button
                type="button"
                className="flex size-7 cursor-pointer items-center justify-center rounded-full border-none bg-gray-100 text-sm text-gray-500 transition hover:bg-gray-200"
                onClick={handleCloseEdit}
                aria-label="Fechar"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <p className="text-sm font-medium text-gray-900">{editingEvent.title}</p>
            <p className="-mt-1.5 text-sm text-gray-500">
              {editingEvent.park} · {editingEvent.date} · {editingEvent.time}
            </p>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="eventStatus" className="text-sm font-medium text-gray-600">
                Status do evento
              </label>
              <Select
                id="eventStatus"
                value={eventStatusDraft ?? ""}
                onChange={handleEventStatusChange}
              >
                {EVENT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="eventSpots" className="text-sm font-medium text-gray-600">
                Vagas restantes
              </label>
              <Input
                id="eventSpots"
                type="number"
                min={0}
                max={editingEvent.spots}
                value={eventSpotsDraft}
                onChange={handleEventSpotsChange}
              />
              <p className="mt-0.5 text-xs text-gray-500">
                Capacidade total do evento: {editingEvent.spots} vagas
              </p>
            </div>

            <div className="mt-1 flex justify-end gap-3">
              <button
                type="button"
                className="cursor-pointer rounded-md border-none bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                onClick={handleCloseEdit}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-md border-none bg-green-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-800"
                onClick={saveEvent}
              >
                Salvar alterações
              </button>
            </div>
          </div>
        </dialog>
      )}

      {deleteTargetId && (
        <dialog
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          aria-modal="true"
          aria-label="Confirmar exclusão"
          open
        >
          <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border-t-4 border-red-400 bg-white p-7 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-green-800">Confirmar exclusão</h2>
              <button
                type="button"
                className="flex size-7 cursor-pointer items-center justify-center rounded-full border-none bg-gray-100 text-sm text-gray-500 transition hover:bg-gray-200"
                onClick={handleCloseDelete}
                aria-label="Fechar"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3.5 text-sm leading-relaxed text-gray-700">
              <span className="inline-flex items-start gap-1.5">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  Esta ação é <strong>irreversível</strong>. O registro será removido
                  permanentemente da listagem.
                </span>
              </span>
            </p>
            <p className="text-sm leading-normal text-gray-500 italic">
              Em produção, esta ação exigiria confirmação dupla e registro em log de auditoria.
            </p>
            <div className="mt-1 flex justify-end gap-3">
              <button
                type="button"
                className="cursor-pointer rounded-md border-none bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                onClick={handleCloseDelete}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-md border-none bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                onClick={executeDelete}
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
