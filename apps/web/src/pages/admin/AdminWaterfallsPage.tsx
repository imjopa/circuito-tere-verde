import type { NewWaterfall, Park, Waterfall, WaterfallAccess } from "@circuito/db/client";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { AlertTriangle, Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { AdminWaterfallCard } from "@/components/admin/AdminWaterfallCard";
import {
  WaterfallFormFields,
  type WaterfallFormState,
} from "@/components/admin/WaterfallFormFields";
import { ConfirmDialog, Modal, ModalFooter } from "@/components/ui/Modal";
import { LoadingMessage } from "@/components/ui/QueryFeedback";
import { useParks } from "@/hooks/data/useParks";
import { useWaterfalls } from "@/hooks/data/useWaterfalls";
import { parseCommaList } from "@/lib/admin-form-utils";
import { queryClient } from "@/lib/query-client";

const EMPTY_FORM: WaterfallFormState = {
  name: "",
  parkId: "",
  heightMeters: "",
  access: "easy",
  allowsBathing: true,
  description: "",
  accessibility: "",
  howToGet: "",
  tips: "",
};

function waterfallToForm(waterfall: Waterfall): WaterfallFormState {
  return {
    name: waterfall.name,
    parkId: waterfall.parkId,
    heightMeters: String(waterfall.heightMeters),
    access: waterfall.access,
    allowsBathing: waterfall.allowsBathing,
    description: waterfall.description,
    accessibility: waterfall.accessibility,
    howToGet: waterfall.howToGet,
    tips: waterfall.tips.join(", "),
  };
}

function formToPayload(form: WaterfallFormState, park: Park): NewWaterfall {
  return {
    name: form.name.trim(),
    parkId: park.id,
    parkName: park.name,
    heightMeters: Number(form.heightMeters) || 0,
    access: form.access,
    allowsBathing: form.allowsBathing,
    description: form.description.trim(),
    accessibility: form.accessibility.trim(),
    howToGet: form.howToGet.trim(),
    tips: parseCommaList(form.tips),
  };
}

export default function AdminWaterfallsPage() {
  const waterfalls = useWaterfalls();
  const parks = useParks();

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingWaterfall, setEditingWaterfall] = useState<Waterfall | null>(null);
  const [editForm, setEditForm] = useState<WaterfallFormState | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const createWaterfall = useMutation({
    mutationFn: (data: NewWaterfall) =>
      ky.post("/api/waterfalls", { json: data }).json<Waterfall>(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["waterfalls"] });
      setShowCreate(false);
      setCreateForm(EMPTY_FORM);
      setCreateError(null);
    },
    onError: () =>
      setCreateError("Não foi possível criar a cachoeira. Verifique os dados e tente novamente."),
  });

  const updateWaterfall = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewWaterfall> }) =>
      ky.patch(`/api/waterfalls/${id}`, { json: data }).json<Waterfall>(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["waterfalls"] });
      setEditingWaterfall(null);
      setEditForm(null);
      setEditError(null);
    },
    onError: () =>
      setEditError("Não foi possível salvar a cachoeira. Verifique os dados e tente novamente."),
  });

  const deleteWaterfall = useMutation({
    mutationFn: (id: string) => ky.delete(`/api/waterfalls/${id}`).json<Waterfall>(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["waterfalls"] });
      setDeleteTargetId(null);
    },
  });

  const updateCreateField = useCallback(
    (field: keyof WaterfallFormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value =
          field === "access"
            ? (e.target.value as WaterfallAccess)
            : e.target.type === "checkbox"
              ? (e.target as HTMLInputElement).checked
              : e.target.value;
        setCreateForm((prev) => ({ ...prev, [field]: value }));
      },
    [],
  );

  const updateEditField = useCallback(
    (field: keyof WaterfallFormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value =
          field === "access"
            ? (e.target.value as WaterfallAccess)
            : e.target.type === "checkbox"
              ? (e.target as HTMLInputElement).checked
              : e.target.value;
        setEditForm((prev) => (prev ? { ...prev, [field]: value } : prev));
      },
    [],
  );

  const submitForm = useCallback(
    async (form: WaterfallFormState, mode: "create" | "edit") => {
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
        await createWaterfall.mutateAsync(payload);
      } else if (editingWaterfall) {
        setEditError(null);
        await updateWaterfall.mutateAsync({ id: editingWaterfall.id, data: payload });
      }
    },
    [parks.data, createWaterfall, updateWaterfall, editingWaterfall],
  );

  const handleCreateSubmit = useCallback(
    () => submitForm(createForm, "create"),
    [createForm, submitForm],
  );

  const handleEditSubmit = useCallback(async () => {
    if (!editForm) return;
    await submitForm(editForm, "edit");
  }, [editForm, submitForm]);

  const handleOpenEdit = useCallback((waterfall: Waterfall) => {
    setEditingWaterfall(waterfall);
    setEditForm(waterfallToForm(waterfall));
    setEditError(null);
  }, []);

  const handleCloseCreate = useCallback(() => {
    setShowCreate(false);
    setCreateForm(EMPTY_FORM);
    setCreateError(null);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditingWaterfall(null);
    setEditForm(null);
    setEditError(null);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setDeleteTargetId(null);
  }, []);

  const executeDelete = useCallback(async () => {
    if (!deleteTargetId) return;
    await deleteWaterfall.mutateAsync(deleteTargetId);
  }, [deleteTargetId, deleteWaterfall]);

  return (
    <>
      {waterfalls.isLoading ? (
        <LoadingMessage>Carregando cachoeiras...</LoadingMessage>
      ) : (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {waterfalls.data?.length ?? 0} cachoeiras cadastradas
            </p>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border-none bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="size-4" aria-hidden />
              Nova cachoeira
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {waterfalls.data?.map((wf) => (
              <AdminWaterfallCard
                key={wf.id}
                waterfall={wf}
                onEdit={handleOpenEdit}
                onDelete={setDeleteTargetId}
              />
            ))}
          </div>
        </section>
      )}

      <Modal
        open={showCreate}
        title="Nova cachoeira"
        onClose={handleCloseCreate}
        ariaLabel="Nova cachoeira"
      >
        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
          {createError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {createError}
            </p>
          )}
          <WaterfallFormFields
            idPrefix="create-wf"
            form={createForm}
            parks={parks.data}
            onFieldChange={updateCreateField}
          />
        </div>
        <ModalFooter
          onCancel={handleCloseCreate}
          onConfirm={handleCreateSubmit}
          confirmLabel={createWaterfall.isPending ? "Salvando…" : "Criar cachoeira"}
        />
      </Modal>

      <Modal
        open={!!editingWaterfall && !!editForm}
        title="Editar cachoeira"
        onClose={handleCloseEdit}
        ariaLabel="Editar cachoeira"
      >
        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
          {editError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {editError}
            </p>
          )}
          {editForm && (
            <WaterfallFormFields
              idPrefix="edit-wf"
              form={editForm}
              parks={parks.data}
              onFieldChange={updateEditField}
            />
          )}
        </div>
        <ModalFooter
          onCancel={handleCloseEdit}
          onConfirm={handleEditSubmit}
          confirmLabel={updateWaterfall.isPending ? "Salvando…" : "Salvar alterações"}
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
                Esta ação é <strong>irreversível</strong>. A cachoeira será removida permanentemente
                da listagem.
              </span>
            </span>
          </p>
        }
      />
    </>
  );
}
