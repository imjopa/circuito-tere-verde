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

import {
  AdminEventCard,
  DEFAULT_EVENT_STATUS,
  EVENT_STATUS_OPTIONS,
} from "@/components/admin/AdminEventCard";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog, Modal, ModalFooter } from "@/components/ui/Modal";
import { LoadingMessage } from "@/components/ui/QueryFeedback";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { useEvents } from "@/hooks/data/useEvents";
import { useParks } from "@/hooks/data/useParks";
import { parseCommaList } from "@/lib/admin-form-utils";
import { queryClient } from "@/lib/query-client";

const CATEGORY_OPTIONS = [
  { value: "guided_trail", label: "Trilha guiada" },
  { value: "education", label: "Educação ambiental" },
  { value: "volunteer", label: "Voluntariado" },
  { value: "workshop", label: "Oficina" },
] as const;

const EMPTY_CREATE_FORM = {
  title: "",
  parkId: "",
  date: "",
  duration: "",
  category: "guided_trail" as ParkEventCategory,
  status: "open" as ParkEventStatus,
  spots: "",
  spotsLeft: "",
  description: "",
  priceCents: "",
  requirements: "",
};

export default function AdminEventsPage() {
  const events = useEvents();
  const parks = useParks();

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

  const createEvent = useMutation({
    mutationFn: (data: NewParkEvent) => ky.post("/api/events", { json: data }).json<ParkEvent>(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      setShowCreate(false);
      setCreateForm(EMPTY_CREATE_FORM);
      setSpotsLeftManual(false);
      setCreateError(null);
    },
    onError: () =>
      setCreateError("Não foi possível criar o evento. Verifique os dados e tente novamente."),
  });

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE_FORM);
  const [spotsLeftManual, setSpotsLeftManual] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
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

  const updateCreateField = useCallback(
    (field: keyof typeof EMPTY_CREATE_FORM) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setCreateForm((prev) => {
          const next = { ...prev, [field]: value };
          if (field === "spots" && !spotsLeftManual) {
            next.spotsLeft = value;
          }
          return next;
        });
      },
    [spotsLeftManual],
  );

  const handleSpotsLeftChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSpotsLeftManual(true);
    setCreateForm((prev) => ({ ...prev, spotsLeft: e.target.value }));
  }, []);

  const handleCreateSubmit = useCallback(async () => {
    if (!createForm.title.trim() || !createForm.parkId || !createForm.date) {
      setCreateError("Preencha título, parque e data.");
      return;
    }

    setCreateError(null);
    const spots = Number(createForm.spots) || 0;
    await createEvent.mutateAsync({
      title: createForm.title.trim(),
      parkId: createForm.parkId,
      date: createForm.date,
      duration: createForm.duration.trim(),
      category: createForm.category,
      status: createForm.status,
      spots,
      spotsLeft: Number(createForm.spotsLeft) || spots,
      description: createForm.description.trim(),
      priceCents: Number(createForm.priceCents) || 0,
      requirements: parseCommaList(createForm.requirements),
    });
  }, [createForm, createEvent]);

  const handleCloseCreate = useCallback(() => {
    setShowCreate(false);
    setCreateForm(EMPTY_CREATE_FORM);
    setSpotsLeftManual(false);
    setCreateError(null);
  }, []);

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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="eventTitle" className="text-sm font-medium text-gray-600">
              Título
            </label>
            <Input id="eventTitle" value={createForm.title} onChange={updateCreateField("title")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="eventPark" className="text-sm font-medium text-gray-600">
              Parque
            </label>
            <Select id="eventPark" value={createForm.parkId} onChange={updateCreateField("parkId")}>
              <option value="">Selecione um parque</option>
              {parks.data?.map((park) => (
                <option key={park.id} value={park.id}>
                  {park.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="eventDate" className="text-sm font-medium text-gray-600">
                Data
              </label>
              <Input
                id="eventDate"
                type="date"
                value={createForm.date}
                onChange={updateCreateField("date")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="eventDuration" className="text-sm font-medium text-gray-600">
                Duração
              </label>
              <Input
                id="eventDuration"
                value={createForm.duration}
                onChange={updateCreateField("duration")}
                placeholder="Ex.: 4h"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="eventCategory" className="text-sm font-medium text-gray-600">
                Categoria
              </label>
              <Select
                id="eventCategory"
                value={createForm.category}
                onChange={updateCreateField("category")}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="eventStatusCreate" className="text-sm font-medium text-gray-600">
                Status
              </label>
              <Select
                id="eventStatusCreate"
                value={createForm.status}
                onChange={updateCreateField("status")}
              >
                {EVENT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="eventSpotsTotal" className="text-sm font-medium text-gray-600">
                Vagas totais
              </label>
              <Input
                id="eventSpotsTotal"
                type="number"
                min={0}
                value={createForm.spots}
                onChange={updateCreateField("spots")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="eventSpotsLeft" className="text-sm font-medium text-gray-600">
                Vagas restantes
              </label>
              <Input
                id="eventSpotsLeft"
                type="number"
                min={0}
                value={createForm.spotsLeft}
                onChange={handleSpotsLeftChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="eventPrice" className="text-sm font-medium text-gray-600">
              Preço (centavos)
            </label>
            <Input
              id="eventPrice"
              type="number"
              min={0}
              value={createForm.priceCents}
              onChange={updateCreateField("priceCents")}
            />
            <p className="text-xs text-gray-500">0 = gratuito</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="eventDescription" className="text-sm font-medium text-gray-600">
              Descrição
            </label>
            <TextArea
              id="eventDescription"
              value={createForm.description}
              onChange={updateCreateField("description")}
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="eventRequirements" className="text-sm font-medium text-gray-600">
              Requisitos
            </label>
            <TextArea
              id="eventRequirements"
              value={createForm.requirements}
              onChange={updateCreateField("requirements")}
              rows={2}
              placeholder="Separados por vírgula"
            />
          </div>
        </div>
        <ModalFooter
          onCancel={handleCloseCreate}
          onConfirm={handleCreateSubmit}
          confirmLabel={createEvent.isPending ? "Salvando…" : "Criar evento"}
        />
      </Modal>

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
