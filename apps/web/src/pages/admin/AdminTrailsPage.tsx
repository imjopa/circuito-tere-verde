import type { NewTrail, Park, Trail, TrailDifficulty, TrailStatus } from "@circuito/db/client";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { AlertTriangle, Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { AdminTrailCard } from "@/components/admin/AdminTrailCard";
import { TrailFormFields, type TrailFormState } from "@/components/admin/TrailFormFields";
import { ConfirmDialog, Modal, ModalFooter } from "@/components/ui/Modal";
import { LoadingMessage } from "@/components/ui/QueryFeedback";
import { useParks } from "@/hooks/data/useParks";
import { useTrails } from "@/hooks/data/useTrails";
import { parseCommaList } from "@/lib/admin-form-utils";
import { queryClient } from "@/lib/query-client";

const EMPTY_FORM: TrailFormState = {
  name: "",
  parkId: "",
  difficulty: "medium",
  distanceMeters: "",
  duration: "",
  altitudeMeters: "",
  status: "open",
  description: "",
  conditions: "",
  tips: "",
};

function trailToForm(trail: Trail): TrailFormState {
  return {
    name: trail.name,
    parkId: trail.parkId,
    difficulty: trail.difficulty,
    distanceMeters: String(trail.distanceMeters),
    duration: trail.duration,
    altitudeMeters: String(trail.altitudeMeters),
    status: trail.status,
    description: trail.description,
    conditions: trail.conditions,
    tips: trail.tips.join(", "),
  };
}

function formToPayload(form: TrailFormState, park: Park): NewTrail {
  return {
    name: form.name.trim(),
    parkId: park.id,
    parkName: park.name,
    difficulty: form.difficulty,
    distanceMeters: Number(form.distanceMeters) || 0,
    duration: form.duration.trim(),
    altitudeMeters: Number(form.altitudeMeters) || 0,
    status: form.status,
    description: form.description.trim(),
    conditions: form.conditions.trim(),
    tips: parseCommaList(form.tips),
  };
}

export default function AdminTrailsPage() {
  const trails = useTrails();
  const parks = useParks();

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingTrail, setEditingTrail] = useState<Trail | null>(null);
  const [editForm, setEditForm] = useState<TrailFormState | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const updateTrail = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewTrail> }) =>
      ky.patch(`/api/trails/${id}`, { json: data }).json<Trail>(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["trails"] });
      setEditingTrail(null);
      setEditForm(null);
      setEditError(null);
    },
    onError: () =>
      setEditError("Não foi possível salvar a trilha. Verifique os dados e tente novamente."),
  });

  const deleteTrail = useMutation({
    mutationFn: (id: string) => ky.delete(`/api/trails/${id}`).json<Trail>(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["trails"] });
      setDeleteTargetId(null);
    },
  });

  const createTrail = useMutation({
    mutationFn: (data: NewTrail) => ky.post("/api/trails", { json: data }).json<Trail>(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["trails"] });
      setShowCreate(false);
      setCreateForm(EMPTY_FORM);
      setCreateError(null);
    },
    onError: () =>
      setCreateError("Não foi possível criar a trilha. Verifique os dados e tente novamente."),
  });

  const updateCreateField = useCallback(
    (field: keyof TrailFormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value =
          field === "difficulty"
            ? (e.target.value as TrailDifficulty)
            : field === "status"
              ? (e.target.value as TrailStatus)
              : e.target.value;
        setCreateForm((prev) => ({ ...prev, [field]: value }));
      },
    [],
  );

  const updateEditField = useCallback(
    (field: keyof TrailFormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value =
          field === "difficulty"
            ? (e.target.value as TrailDifficulty)
            : field === "status"
              ? (e.target.value as TrailStatus)
              : e.target.value;
        setEditForm((prev) => (prev ? { ...prev, [field]: value } : prev));
      },
    [],
  );

  const submitForm = useCallback(
    async (form: TrailFormState, mode: "create" | "edit") => {
      const park = parks.data?.find((p) => p.id === form.parkId);
      if (!form.name.trim() || !park) {
        const message = "Preencha o nome e selecione um parque.";
        if (mode === "create") setCreateError(message);
        else setEditError(message);
        return;
      }

      const payload = formToPayload(form, park);

      if (mode === "create") {
        setCreateError(null);
        await createTrail.mutateAsync(payload);
      } else if (editingTrail) {
        setEditError(null);
        await updateTrail.mutateAsync({ id: editingTrail.id, data: payload });
      }
    },
    [parks.data, createTrail, updateTrail, editingTrail],
  );

  const handleCreateSubmit = useCallback(
    () => submitForm(createForm, "create"),
    [createForm, submitForm],
  );

  const handleEditSubmit = useCallback(async () => {
    if (!editForm) return;
    await submitForm(editForm, "edit");
  }, [editForm, submitForm]);

  const handleOpenEdit = useCallback((trail: Trail) => {
    setEditingTrail(trail);
    setEditForm(trailToForm(trail));
    setEditError(null);
  }, []);

  const handleCloseCreate = useCallback(() => {
    setShowCreate(false);
    setCreateForm(EMPTY_FORM);
    setCreateError(null);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditingTrail(null);
    setEditForm(null);
    setEditError(null);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setDeleteTargetId(null);
  }, []);

  const executeDelete = useCallback(async () => {
    if (!deleteTargetId) return;
    await deleteTrail.mutateAsync(deleteTargetId);
  }, [deleteTargetId, deleteTrail]);

  return (
    <>
      {trails.isLoading ? (
        <LoadingMessage>Carregando trilhas...</LoadingMessage>
      ) : (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{trails.data?.length ?? 0} trilhas cadastradas</p>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-none bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="size-4" aria-hidden />
              Nova trilha
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {trails.data?.map((trail) => (
              <AdminTrailCard
                key={trail.id}
                trail={trail}
                onEdit={handleOpenEdit}
                onDelete={setDeleteTargetId}
              />
            ))}
          </div>
        </section>
      )}

      <Modal
        open={showCreate}
        title="Nova trilha"
        onClose={handleCloseCreate}
        ariaLabel="Nova trilha"
      >
        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
          {createError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {createError}
            </p>
          )}
          <TrailFormFields
            idPrefix="create-trail"
            form={createForm}
            parks={parks.data}
            onFieldChange={updateCreateField}
          />
        </div>
        <ModalFooter
          onCancel={handleCloseCreate}
          onConfirm={handleCreateSubmit}
          confirmLabel={createTrail.isPending ? "Salvando…" : "Criar trilha"}
        />
      </Modal>

      <Modal
        open={!!editingTrail && !!editForm}
        title="Editar trilha"
        onClose={handleCloseEdit}
        ariaLabel="Editar trilha"
      >
        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
          {editError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {editError}
            </p>
          )}
          {editForm && (
            <TrailFormFields
              idPrefix="edit-trail"
              form={editForm}
              parks={parks.data}
              onFieldChange={updateEditField}
            />
          )}
        </div>
        <ModalFooter
          onCancel={handleCloseEdit}
          onConfirm={handleEditSubmit}
          confirmLabel={updateTrail.isPending ? "Salvando…" : "Salvar alterações"}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTargetId}
        onCancel={handleCloseDelete}
        onConfirm={executeDelete}
        message={
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3.5 text-sm leading-relaxed text-gray-700">
            <span className="inline-flex items-start gap-1.5">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                Esta ação é <strong>irreversível</strong>. O registro será removido permanentemente
                da listagem.
              </span>
            </span>
          </p>
        }
      />
    </>
  );
}
