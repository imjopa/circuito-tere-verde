import type { Park, ParkEvent, ParkEventStatus } from "@circuito/db";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { AlertTriangle, Pencil, Trash2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { tv } from "tailwind-variants";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useEvents } from "@/hooks/data/useEvents";
import { queryClient } from "@/lib/query-client";

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
  const events = useEvents();

  const updateEvent = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { status: ParkEventStatus; spotsLeft: number };
    }) => ky.patch(`/api/events/${id}`, { json: data }).json<ParkEvent>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });

  const deleteEvent = useMutation({
    mutationFn: (id: string) => ky.delete(`/api/events/${id}`).json<ParkEvent>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });

  const [editingEvent, setEditingEvent] = useState<(ParkEvent & { park: Park }) | null>(null);
  const [eventStatusDraft, setEventStatusDraft] = useState<ParkEventStatus | null>(null);
  const [eventSpotsDraft, setEventSpotsDraft] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const saveEvent = useCallback(async () => {
    if (!editingEvent) return;

    await updateEvent.mutateAsync({
      id: editingEvent.id,
      data: {
        status: eventStatusDraft ?? DEFAULT_EVENT_STATUS,
        spotsLeft: Number(eventSpotsDraft),
      },
    });
    setEditingEvent(null);
  }, [editingEvent, eventStatusDraft, eventSpotsDraft, updateEvent]);

  const executeDelete = useCallback(async () => {
    if (!deleteTargetId) return;
    await deleteEvent.mutateAsync(deleteTargetId);
    setDeleteTargetId(null);
  }, [deleteTargetId, deleteEvent]);

  const handleCloseEdit = useCallback(() => {
    setEditingEvent(null);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setDeleteTargetId(null);
  }, []);

  const handleOpenEdit = useCallback((ev: ParkEvent & { park: Park }) => {
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
      {events.isLoading ? (
        <p className="text-sm text-gray-500">Carregando eventos...</p>
      ) : (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{events.data?.length ?? 0} eventos cadastrados</p>
          </div>
          <div className="flex flex-col gap-3">
            {events.data?.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                onEdit={handleOpenEdit}
                onDelete={setDeleteTargetId}
              />
            ))}
          </div>
        </section>
      )}

      {editingEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          aria-modal="true"
          aria-label="Editar evento"
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
              {editingEvent.park.name} ·{" "}
              {new Date(editingEvent.date).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              · {editingEvent.duration}
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
        </div>
      )}

      {deleteTargetId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          aria-modal="true"
          aria-label="Confirmar exclusão"
          // cannot be a native dialog
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
          role="dialog"
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
        </div>
      )}
    </>
  );
}

interface EventCardProps {
  event: ParkEvent & { park: Park };
  onEdit: (event: ParkEvent & { park: Park }) => void;
  onDelete: (id: string) => void;
}

function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const dateStr = new Date(event.date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const handleEdit = useCallback(() => onEdit(event), [event, onEdit]);
  const handleDelete = useCallback(() => onDelete(event.id), [event.id, onDelete]);

  return (
    <div
      key={event.id}
      className={`flex items-start justify-between gap-4 rounded-lg border border-gray-100 bg-white px-5 py-4 transition hover:shadow-sm${
        event.status === "cancelled" ? " opacity-55" : ""
      }`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3.5">
        <div className={eventStatusPillVariants({ status: event.status })}>
          {EVENT_STATUS_OPTIONS.find((o) => o.value === event.status)?.label ?? event.status}
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 truncate text-sm font-medium text-gray-900">{event.title}</p>
          <p className="mb-1 text-sm text-gray-500">
            {event.park.name} · {dateStr} · {event.duration}
          </p>
          <p className="rounded-sm border-l-4 border-green-300 bg-gray-50 px-2 py-1 text-sm leading-normal text-gray-600">
            {event.spotsLeft} vagas restantes de {event.spots} ·{" "}
            {(event.priceCents / 100).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col gap-2">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-green-800 transition hover:bg-green-100"
          onClick={handleEdit}
          aria-label={`Editar evento ${event.title}`}
        >
          <Pencil className="size-3.5" aria-hidden />
          Editar
        </button>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-red-700 transition hover:bg-red-100"
          onClick={handleDelete}
          aria-label={`Excluir evento ${event.title}`}
        >
          <Trash2 className="size-3.5" aria-hidden />
          Excluir
        </button>
      </div>
    </div>
  );
}
