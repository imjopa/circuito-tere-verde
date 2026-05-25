import type { Park, ParkEvent, ParkEventStatus } from "@circuito/db/client";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { AlertTriangle } from "lucide-react";
import { useCallback, useState } from "react";

import {
  AdminEventCard,
  DEFAULT_EVENT_STATUS,
  EVENT_STATUS_OPTIONS,
} from "@/components/admin/AdminEventCard";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog, Modal, ModalFooter } from "@/components/ui/Modal";
import { LoadingMessage } from "@/components/ui/QueryFeedback";
import { Select } from "@/components/ui/Select";
import { useEvents } from "@/hooks/data/useEvents";
import { queryClient } from "@/lib/query-client";

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
        <LoadingMessage>Carregando eventos...</LoadingMessage>
      ) : (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{events.data?.length ?? 0} eventos cadastrados</p>
          </div>
          <div className="flex flex-col gap-3">
            {events.data?.map((ev) => (
              <AdminEventCard
                key={ev.id}
                event={ev}
                onEdit={handleOpenEdit}
                onDelete={setDeleteTargetId}
              />
            ))}
          </div>
        </section>
      )}

      <Modal
        open={!!editingEvent}
        title="Editar evento"
        onClose={handleCloseEdit}
        ariaLabel="Editar evento"
      >
        <p className="text-sm font-medium text-gray-900">{editingEvent?.title}</p>
        <p className="-mt-1.5 text-sm text-gray-500">
          {editingEvent?.park.name} ·{" "}
          {editingEvent &&
            new Date(editingEvent.date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}{" "}
          · {editingEvent?.duration}
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
            max={editingEvent?.spots}
            value={eventSpotsDraft}
            onChange={handleEventSpotsChange}
          />
          <p className="mt-0.5 text-xs text-gray-500">
            Capacidade total do evento: {editingEvent?.spots} vagas
          </p>
        </div>

        <ModalFooter onCancel={handleCloseEdit} onConfirm={saveEvent} />
      </Modal>

      <ConfirmDialog
        open={!!deleteTargetId}
        onCancel={handleCloseDelete}
        onConfirm={executeDelete}
        message={
          <>
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
          </>
        }
      />
    </>
  );
}
