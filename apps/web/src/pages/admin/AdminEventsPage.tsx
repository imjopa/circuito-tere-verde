import type {
  NewParkEvent,
  Park,
  ParkEvent,
  ParkEventCategory,
  ParkEventStatus,
} from "@circuito/db/client";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { AlertTriangle, Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { AdminEventCard } from "@/components/admin/AdminEventCard";
import { EventFormFields, type EventFormState } from "@/components/admin/EventFormFields";
import { ConfirmDialog, Modal, ModalFooter } from "@/components/ui/Modal";
import { LoadingMessage } from "@/components/ui/QueryFeedback";
import { useEvents } from "@/hooks/data/useEvents";
import { useParks } from "@/hooks/data/useParks";
import { parseCommaList } from "@/lib/admin-form-utils";
import { queryClient } from "@/lib/query-client";

const EMPTY_FORM: EventFormState = {
  title: "",
  parkId: "",
  date: "",
  duration: "",
  category: "guided_trail",
  status: "open",
  spots: "",
  spotsLeft: "",
  description: "",
  priceCents: "",
  requirements: "",
};

function eventToForm(event: ParkEvent): EventFormState {
  return {
    title: event.title,
    parkId: event.parkId,
    date: event.date.slice(0, 10),
    duration: event.duration,
    category: event.category,
    status: event.status,
    spots: String(event.spots),
    spotsLeft: String(event.spotsLeft),
    description: event.description,
    priceCents: String(event.priceCents),
    requirements: event.requirements.join(", "),
  };
}

function formToPayload(form: EventFormState): NewParkEvent {
  const spots = Number(form.spots) || 0;
  return {
    title: form.title.trim(),
    parkId: form.parkId,
    date: form.date,
    duration: form.duration.trim(),
    category: form.category,
    status: form.status,
    spots,
    spotsLeft: Number(form.spotsLeft) || spots,
    description: form.description.trim(),
    priceCents: Number(form.priceCents) || 0,
    requirements: parseCommaList(form.requirements),
  };
}

export default function AdminEventsPage() {
  const events = useEvents();
  const parks = useParks();

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [createSpotsLeftManual, setCreateSpotsLeftManual] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingEvent, setEditingEvent] = useState<(ParkEvent & { park: Park }) | null>(null);
  const [editForm, setEditForm] = useState<EventFormState | null>(null);
  const [editSpotsLeftManual, setEditSpotsLeftManual] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const updateEvent = useMutation({
    mutationFn: ({ id, data }: { id: string; data: NewParkEvent }) =>
      ky.patch(`/api/events/${id}`, { json: data }).json<ParkEvent>(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      setEditingEvent(null);
      setEditForm(null);
      setEditSpotsLeftManual(false);
      setEditError(null);
    },
    onError: () =>
      setEditError("Não foi possível salvar o evento. Verifique os dados e tente novamente."),
  });

  const deleteEvent = useMutation({
    mutationFn: (id: string) => ky.delete(`/api/events/${id}`).json<ParkEvent>(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      setDeleteTargetId(null);
    },
  });

  const createEvent = useMutation({
    mutationFn: (data: NewParkEvent) => ky.post("/api/events", { json: data }).json<ParkEvent>(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      setShowCreate(false);
      setCreateForm(EMPTY_FORM);
      setCreateSpotsLeftManual(false);
      setCreateError(null);
    },
    onError: () =>
      setCreateError("Não foi possível criar o evento. Verifique os dados e tente novamente."),
  });

  const updateCreateField = useCallback(
    (field: keyof EventFormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value =
          field === "category"
            ? (e.target.value as ParkEventCategory)
            : field === "status"
              ? (e.target.value as ParkEventStatus)
              : e.target.value;
        setCreateForm((prev) => {
          const next = { ...prev, [field]: value };
          if (field === "spots" && !createSpotsLeftManual) {
            next.spotsLeft = value;
          }
          return next;
        });
      },
    [createSpotsLeftManual],
  );

  const updateEditField = useCallback(
    (field: keyof EventFormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value =
          field === "category"
            ? (e.target.value as ParkEventCategory)
            : field === "status"
              ? (e.target.value as ParkEventStatus)
              : e.target.value;
        setEditForm((prev) => {
          if (!prev) return prev;
          const next = { ...prev, [field]: value };
          if (field === "spots" && !editSpotsLeftManual) {
            next.spotsLeft = value;
          }
          return next;
        });
        if (field === "spotsLeft") setEditSpotsLeftManual(true);
      },
    [editSpotsLeftManual],
  );

  const handleCreateSpotsLeftChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateSpotsLeftManual(true);
    setCreateForm((prev) => ({ ...prev, spotsLeft: e.target.value }));
  }, []);

  const handleEditSpotsLeftChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditSpotsLeftManual(true);
    setEditForm((prev) => (prev ? { ...prev, spotsLeft: e.target.value } : prev));
  }, []);

  const submitForm = useCallback(
    async (form: EventFormState, mode: "create" | "edit") => {
      if (!form.title.trim() || !form.parkId || !form.date) {
        const message = "Preencha título, parque e data.";
        if (mode === "create") setCreateError(message);
        else setEditError(message);
        return;
      }

      const payload = formToPayload(form);

      if (mode === "create") {
        setCreateError(null);
        await createEvent.mutateAsync(payload);
      } else if (editingEvent) {
        setEditError(null);
        await updateEvent.mutateAsync({ id: editingEvent.id, data: payload });
      }
    },
    [createEvent, updateEvent, editingEvent],
  );

  const handleCreateSubmit = useCallback(
    () => submitForm(createForm, "create"),
    [createForm, submitForm],
  );

  const handleEditSubmit = useCallback(async () => {
    if (!editForm) return;
    await submitForm(editForm, "edit");
  }, [editForm, submitForm]);

  const handleOpenEdit = useCallback((ev: ParkEvent & { park: Park }) => {
    setEditingEvent(ev);
    setEditForm(eventToForm(ev));
    setEditSpotsLeftManual(false);
    setEditError(null);
  }, []);

  const handleCloseCreate = useCallback(() => {
    setShowCreate(false);
    setCreateForm(EMPTY_FORM);
    setCreateSpotsLeftManual(false);
    setCreateError(null);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditingEvent(null);
    setEditForm(null);
    setEditSpotsLeftManual(false);
    setEditError(null);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setDeleteTargetId(null);
  }, []);

  const executeDelete = useCallback(async () => {
    if (!deleteTargetId) return;
    await deleteEvent.mutateAsync(deleteTargetId);
  }, [deleteTargetId, deleteEvent]);

  return (
    <>
      {events.isLoading ? (
        <LoadingMessage>Carregando eventos...</LoadingMessage>
      ) : (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{events.data?.length ?? 0} eventos cadastrados</p>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-none bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="size-4" aria-hidden />
              Novo evento
            </button>
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
        open={showCreate}
        title="Novo evento"
        onClose={handleCloseCreate}
        ariaLabel="Novo evento"
      >
        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
          {createError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {createError}
            </p>
          )}
          <EventFormFields
            idPrefix="create-event"
            form={createForm}
            parks={parks.data}
            onFieldChange={updateCreateField}
            onSpotsLeftChange={handleCreateSpotsLeftChange}
          />
        </div>
        <ModalFooter
          onCancel={handleCloseCreate}
          onConfirm={handleCreateSubmit}
          confirmLabel={createEvent.isPending ? "Salvando…" : "Criar evento"}
        />
      </Modal>

      <Modal
        open={!!editingEvent && !!editForm}
        title="Editar evento"
        onClose={handleCloseEdit}
        ariaLabel="Editar evento"
      >
        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
          {editError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {editError}
            </p>
          )}
          {editForm && (
            <EventFormFields
              idPrefix="edit-event"
              form={editForm}
              parks={parks.data}
              onFieldChange={updateEditField}
              onSpotsLeftChange={handleEditSpotsLeftChange}
            />
          )}
        </div>
        <ModalFooter
          onCancel={handleCloseEdit}
          onConfirm={handleEditSubmit}
          confirmLabel={updateEvent.isPending ? "Salvando…" : "Salvar alterações"}
        />
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
