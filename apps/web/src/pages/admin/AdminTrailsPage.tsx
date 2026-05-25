import type { Trail, TrailStatus } from "@circuito/db/client";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { AlertTriangle } from "lucide-react";
import { useCallback, useState } from "react";

import { AdminTrailCard } from "@/components/admin/AdminTrailCard";
import { ConfirmDialog, Modal, ModalFooter } from "@/components/ui/Modal";
import { LoadingMessage } from "@/components/ui/QueryFeedback";
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

  return (
    <>
      {trails.isLoading ? (
        <LoadingMessage>Carregando trilhas...</LoadingMessage>
      ) : (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{trails.data?.length ?? 0} trilhas cadastradas</p>
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
