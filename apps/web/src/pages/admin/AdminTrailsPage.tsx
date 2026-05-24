import type { Park, Trail, TrailStatus } from "@circuito/db/client";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { AlertTriangle, Pencil, Trash2, X } from "lucide-react";
import { useCallback, useState } from "react";

import { Select } from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import { TextArea } from "@/components/ui/TextArea";
import { useTrails } from "@/hooks/data/useTrails";
import { queryClient } from "@/lib/query-client";

const DEFAULT_TRAIL_STATUS: TrailStatus = "open";

const TRAIL_STATUS_OPTIONS = [
  { value: "open", label: "Aberta" },
  { value: "closed", label: "Fechada" },
  { value: "maintenance", label: "Manutenção" },
  { value: "climate_risk", label: "Risco Climático" },
  { value: "full", label: "Lotada" },
] as const;

export default function AdminTrailsPage() {
  const trails = useTrails();

  const updateTrail = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: TrailStatus; conditions: string } }) =>
      ky.patch(`/api/trails/${id}`, { json: data }).json<Trail>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trails"] }),
  });

  const deleteTrail = useMutation({
    mutationFn: (id: string) => ky.delete(`/api/trails/${id}`).json<Trail>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trails"] }),
  });

  const [editingTrail, setEditingTrail] = useState<Trail | null>(null);
  const [trailStatusDraft, setTrailStatusDraft] = useState<TrailStatus | null>(null);
  const [trailCondDraft, setTrailCondDraft] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenEdit = useCallback(
    (trail: Trail) => {
      setEditingTrail(trail);
      setTrailStatusDraft(trail.status);
      setTrailCondDraft(trail.conditions);
    },
    [setEditingTrail, setTrailStatusDraft, setTrailCondDraft],
  );

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

  const handleTrailStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setTrailStatusDraft(e.target.value as TrailStatus);
    },
    [setTrailStatusDraft],
  );

  const handleTrailCondChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTrailCondDraft(e.target.value);
    },
    [setTrailCondDraft],
  );

  const handleCloseEdit = useCallback(() => {
    setEditingTrail(null);
  }, [setEditingTrail]);

  const handleCloseDelete = useCallback(() => {
    setDeleteTargetId(null);
  }, [setDeleteTargetId]);

  return (
    <>
      {trails.isLoading ? (
        <p className="text-sm text-gray-500">Carregando trilhas...</p>
      ) : (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{trails.data?.length ?? 0} trilhas cadastradas</p>
          </div>
          <div className="flex flex-col gap-3">
            {trails.data?.map((trail) => (
              <TrailCard
                key={trail.id}
                trail={trail}
                onEdit={handleOpenEdit}
                onDelete={setDeleteTargetId}
              />
            ))}
          </div>
        </section>
      )}

      {editingTrail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          aria-modal="true"
          aria-label="Editar trilha"
          // cannot be a native dialog
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
          role="dialog"
        >
          <div className="flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-7 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-green-800">Editar trilha</h2>
              <button
                type="button"
                className="flex size-7 cursor-pointer items-center justify-center rounded-full border-none bg-gray-100 text-sm text-gray-500 transition hover:bg-gray-200"
                onClick={handleCloseEdit}
                aria-label="Fechar"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <p className="text-sm font-medium text-gray-900">{editingTrail.name}</p>
            <p className="-mt-1.5 text-sm text-gray-500">
              {editingTrail.parkName} · {editingTrail.difficulty}
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
                onClick={saveTrail}
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
          // cannot be a native dialog
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar exclusão"
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

interface TrailCardProps {
  trail: Trail & { park: Park };
  onEdit: (trail: Trail) => void;
  onDelete: (id: string) => void;
}

function TrailCard({ trail, onEdit, onDelete }: TrailCardProps) {
  const handleEditTrail = useCallback(() => onEdit(trail), [trail, onEdit]);
  const handleDeleteTrail = useCallback(() => onDelete(trail.id), [trail.id, onDelete]);
  return (
    <div
      key={trail.id}
      className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 bg-white px-5 py-4 transition hover:shadow-sm"
    >
      <div className="flex min-w-0 flex-1 items-start gap-3.5">
        <StatusBadge status={trail.status} />
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 truncate text-sm font-medium text-gray-900">{trail.name}</p>
          <p className="mb-1 text-sm text-gray-500">
            {trail.parkName} · {trail.difficulty} ·{" "}
            {(trail.distanceMeters / 1000).toLocaleString("pt-BR", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 1,
            })}{" "}
            km
          </p>
          <p className="rounded-sm border-l-4 border-green-300 bg-gray-50 px-2 py-1 text-sm leading-normal text-gray-600">
            {trail.conditions}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col gap-2">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-green-800 transition hover:bg-green-100"
          onClick={handleEditTrail}
          aria-label={`Editar trilha ${trail.name}`}
        >
          <Pencil className="size-3.5" aria-hidden />
          Editar
        </button>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-red-700 transition hover:bg-red-100"
          onClick={handleDeleteTrail}
          aria-label={`Excluir trilha ${trail.name}`}
        >
          <Trash2 className="size-3.5" aria-hidden />
          Excluir
        </button>
      </div>
    </div>
  );
}
