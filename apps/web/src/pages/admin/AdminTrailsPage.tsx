import type { NewTrail, Trail, TrailDifficulty, TrailStatus } from "@circuito/db/client";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { AlertTriangle, Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { AdminTrailCard } from "@/components/admin/AdminTrailCard";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog, Modal, ModalFooter } from "@/components/ui/Modal";
import { LoadingMessage } from "@/components/ui/QueryFeedback";
import { Select } from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import { TextArea } from "@/components/ui/TextArea";
import { useParks } from "@/hooks/data/useParks";
import { useTrails } from "@/hooks/data/useTrails";
import { parseCommaList } from "@/lib/admin-form-utils";
import { queryClient } from "@/lib/query-client";

const DEFAULT_TRAIL_STATUS: TrailStatus = "open";

const TRAIL_STATUS_OPTIONS = [
  { value: "open", label: "Aberta" },
  { value: "closed", label: "Fechada" },
  { value: "maintenance", label: "Manutenção" },
  { value: "climate_risk", label: "Risco Climático" },
  { value: "full", label: "Lotada" },
] as const;

const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Fácil" },
  { value: "medium", label: "Médio" },
  { value: "hard", label: "Difícil" },
] as const;

const EMPTY_CREATE_FORM = {
  name: "",
  parkId: "",
  difficulty: "medium" as TrailDifficulty,
  distanceMeters: "",
  duration: "",
  altitudeMeters: "",
  status: "open" as TrailStatus,
  description: "",
  conditions: "",
  tips: "",
};

export default function AdminTrailsPage() {
  const trails = useTrails();
  const parks = useParks();

  const updateTrail = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: TrailStatus; conditions: string } }) =>
      ky.patch(`/api/trails/${id}`, { json: data }).json<Trail>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trails"] }),
  });

  const deleteTrail = useMutation({
    mutationFn: (id: string) => ky.delete(`/api/trails/${id}`).json<Trail>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trails"] }),
  });

  const createTrail = useMutation({
    mutationFn: (data: NewTrail) => ky.post("/api/trails", { json: data }).json<Trail>(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["trails"] });
      setShowCreate(false);
      setCreateForm(EMPTY_CREATE_FORM);
      setCreateError(null);
    },
    onError: () =>
      setCreateError("Não foi possível criar a trilha. Verifique os dados e tente novamente."),
  });

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE_FORM);
  const [createError, setCreateError] = useState<string | null>(null);
  const [editingTrail, setEditingTrail] = useState<Trail | null>(null);
  const [trailStatusDraft, setTrailStatusDraft] = useState<TrailStatus | null>(null);
  const [trailCondDraft, setTrailCondDraft] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenEdit = useCallback((trail: Trail) => {
    setEditingTrail(trail);
    setTrailStatusDraft(trail.status);
    setTrailCondDraft(trail.conditions);
  }, []);

  const saveTrail = useCallback(async () => {
    if (!editingTrail) return;

    await updateTrail.mutateAsync({
      id: editingTrail.id,
      data: {
        status: trailStatusDraft ?? DEFAULT_TRAIL_STATUS,
        conditions: trailCondDraft,
      },
    });
    setEditingTrail(null);
  }, [editingTrail, trailStatusDraft, trailCondDraft, updateTrail]);

  const executeDelete = useCallback(async () => {
    if (!deleteTargetId) return;
    await deleteTrail.mutateAsync(deleteTargetId);
    setDeleteTargetId(null);
  }, [deleteTargetId, deleteTrail]);

  const handleTrailStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setTrailStatusDraft(e.target.value as TrailStatus);
  }, []);

  const handleTrailCondChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTrailCondDraft(e.target.value);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditingTrail(null);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setDeleteTargetId(null);
  }, []);

  const updateCreateField = useCallback(
    (field: keyof typeof EMPTY_CREATE_FORM) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setCreateForm((prev) => ({ ...prev, [field]: e.target.value }));
      },
    [],
  );

  const handleCreateSubmit = useCallback(async () => {
    const park = parks.data?.find((p) => p.id === createForm.parkId);
    if (!createForm.name.trim() || !park) {
      setCreateError("Preencha o nome e selecione um parque.");
      return;
    }

    setCreateError(null);
    await createTrail.mutateAsync({
      name: createForm.name.trim(),
      parkId: park.id,
      parkName: park.name,
      difficulty: createForm.difficulty,
      distanceMeters: Number(createForm.distanceMeters) || 0,
      duration: createForm.duration.trim(),
      altitudeMeters: Number(createForm.altitudeMeters) || 0,
      status: createForm.status,
      description: createForm.description.trim(),
      conditions: createForm.conditions.trim(),
      tips: parseCommaList(createForm.tips),
    });
  }, [createForm, parks.data, createTrail]);

  const handleCloseCreate = useCallback(() => {
    setShowCreate(false);
    setCreateForm(EMPTY_CREATE_FORM);
    setCreateError(null);
  }, []);

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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="trailName" className="text-sm font-medium text-gray-600">
              Nome
            </label>
            <Input id="trailName" value={createForm.name} onChange={updateCreateField("name")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="trailPark" className="text-sm font-medium text-gray-600">
              Parque
            </label>
            <Select id="trailPark" value={createForm.parkId} onChange={updateCreateField("parkId")}>
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
              <label htmlFor="trailDifficulty" className="text-sm font-medium text-gray-600">
                Dificuldade
              </label>
              <Select
                id="trailDifficulty"
                value={createForm.difficulty}
                onChange={updateCreateField("difficulty")}
              >
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="trailStatusCreate" className="text-sm font-medium text-gray-600">
                Status
              </label>
              <Select
                id="trailStatusCreate"
                value={createForm.status}
                onChange={updateCreateField("status")}
              >
                {TRAIL_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="trailDistance" className="text-sm font-medium text-gray-600">
                Distância (m)
              </label>
              <Input
                id="trailDistance"
                type="number"
                min={0}
                value={createForm.distanceMeters}
                onChange={updateCreateField("distanceMeters")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="trailAltitude" className="text-sm font-medium text-gray-600">
                Altitude (m)
              </label>
              <Input
                id="trailAltitude"
                type="number"
                min={0}
                value={createForm.altitudeMeters}
                onChange={updateCreateField("altitudeMeters")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="trailDuration" className="text-sm font-medium text-gray-600">
              Duração
            </label>
            <Input
              id="trailDuration"
              value={createForm.duration}
              onChange={updateCreateField("duration")}
              placeholder="Ex.: 5–6h"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="trailDescription" className="text-sm font-medium text-gray-600">
              Descrição
            </label>
            <TextArea
              id="trailDescription"
              value={createForm.description}
              onChange={updateCreateField("description")}
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="trailConditionsCreate" className="text-sm font-medium text-gray-600">
              Condições atuais
            </label>
            <TextArea
              id="trailConditionsCreate"
              value={createForm.conditions}
              onChange={updateCreateField("conditions")}
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="trailTips" className="text-sm font-medium text-gray-600">
              Dicas
            </label>
            <TextArea
              id="trailTips"
              value={createForm.tips}
              onChange={updateCreateField("tips")}
              rows={2}
              placeholder="Separados por vírgula"
            />
          </div>
        </div>
        <ModalFooter
          onCancel={handleCloseCreate}
          onConfirm={handleCreateSubmit}
          confirmLabel={createTrail.isPending ? "Salvando…" : "Criar trilha"}
        />
      </Modal>

      <Modal
        open={!!editingTrail}
        title="Editar trilha"
        onClose={handleCloseEdit}
        ariaLabel="Editar trilha"
      >
        <p className="text-sm font-medium text-gray-900">{editingTrail?.name}</p>
        <p className="-mt-1.5 text-sm text-gray-500">
          {editingTrail?.parkName} · {editingTrail?.difficulty}
        </p>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="trailStatus" className="text-sm font-medium text-gray-600">
            Status da trilha
          </label>
          <Select
            id="trailStatus"
            value={trailStatusDraft ?? ""}
            onChange={handleTrailStatusChange}
          >
            {TRAIL_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-gray-500">Pré-visualização:</span>
            <StatusBadge status={trailStatusDraft ?? DEFAULT_TRAIL_STATUS} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="trailCond" className="text-sm font-medium text-gray-600">
            Condições atuais
          </label>
          <TextArea
            id="trailCond"
            value={trailCondDraft}
            onChange={handleTrailCondChange}
            rows={3}
            placeholder="Descreva as condições atuais da trilha..."
          />
        </div>

        <ModalFooter onCancel={handleCloseEdit} onConfirm={saveTrail} />
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
