import { type NewPark, type Park, type ParkStatus } from "@circuito/db/client";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { useCallback, useState } from "react";

import { AdminParkCard } from "@/components/admin/AdminParkCard";
import { Input } from "@/components/ui/Input";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { LoadingMessage } from "@/components/ui/QueryFeedback";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { useParks } from "@/hooks/data/useParks";
import { parseCommaList } from "@/lib/admin-form-utils";
import { parkStatusLabels } from "@/lib/constants/labels";
import { queryClient } from "@/lib/query-client";

const PARK_STATUS_OPTIONS = Object.entries(parkStatusLabels).map(([value, label]) => ({
  value,
  label,
}));

type ParkFormState = {
  name: string;
  slug: string;
  type: string;
  status: ParkStatus;
  description: string;
  areaHectares: string;
  altitudeMeters: string;
  openingHours: string;
  entranceFeeCents: string;
  biodiversity: string;
  highlights: string;
};

function parkToForm(park: Park): ParkFormState {
  return {
    name: park.name,
    slug: park.slug,
    type: park.type,
    status: park.status,
    description: park.description,
    areaHectares: String(park.areaHectares),
    altitudeMeters: String(park.altitudeMeters),
    openingHours: park.openingHours,
    entranceFeeCents: String(park.entranceFeeCents),
    biodiversity: park.biodiversity.join(", "),
    highlights: park.highlights.join(", "),
  };
}

export default function AdminParksPage() {
  const parks = useParks();
  const [editingPark, setEditingPark] = useState<Park | null>(null);
  const [form, setForm] = useState<ParkFormState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updatePark = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewPark> }) =>
      ky.patch(`/api/parks/${id}`, { json: data }).json<Park>(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["parks"] });
      setEditingPark(null);
      setForm(null);
      setError(null);
    },
    onError: () =>
      setError("Não foi possível salvar o parque. Verifique os dados e tente novamente."),
  });

  const handleOpenEdit = useCallback((park: Park) => {
    setEditingPark(park);
    setForm(parkToForm(park));
    setError(null);
  }, []);

  const updateField = useCallback(
    (field: keyof ParkFormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = field === "status" ? (e.target.value as ParkStatus) : e.target.value;
        setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
      },
    [],
  );

  const handleSave = useCallback(async () => {
    if (!editingPark || !form) return;

    if (!form.name.trim() || !form.slug.trim() || !form.type.trim()) {
      setError("Preencha nome, slug e tipo.");
      return;
    }

    setError(null);
    await updatePark.mutateAsync({
      id: editingPark.id,
      data: {
        name: form.name.trim(),
        slug: form.slug.trim(),
        type: form.type.trim(),
        status: form.status,
        description: form.description.trim(),
        areaHectares: Number(form.areaHectares) || 0,
        altitudeMeters: Number(form.altitudeMeters) || 0,
        openingHours: form.openingHours.trim(),
        entranceFeeCents: Number(form.entranceFeeCents) || 0,
        biodiversity: parseCommaList(form.biodiversity),
        highlights: parseCommaList(form.highlights),
      },
    });
  }, [editingPark, form, updatePark]);

  const handleCloseEdit = useCallback(() => {
    setEditingPark(null);
    setForm(null);
    setError(null);
  }, []);

  return (
    <>
      {parks.isLoading ? (
        <LoadingMessage>Carregando parques...</LoadingMessage>
      ) : (
        <section className="flex flex-col gap-4">
          <p className="text-sm text-gray-500">{parks.data?.length ?? 0} parques cadastrados</p>
          <div className="flex flex-col gap-3">
            {parks.data?.map((park) => (
              <AdminParkCard key={park.id} park={park} onEdit={handleOpenEdit} />
            ))}
          </div>
        </section>
      )}

      <Modal
        open={!!editingPark && !!form}
        title="Editar parque"
        onClose={handleCloseEdit}
        ariaLabel="Editar parque"
      >
        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="editParkName" className="text-sm font-medium text-gray-600">
              Nome
            </label>
            <Input id="editParkName" value={form?.name ?? ""} onChange={updateField("name")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="editParkSlug" className="text-sm font-medium text-gray-600">
              Slug (URL)
            </label>
            <Input id="editParkSlug" value={form?.slug ?? ""} onChange={updateField("slug")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="editParkType" className="text-sm font-medium text-gray-600">
              Tipo
            </label>
            <Input
              id="editParkType"
              value={form?.type ?? ""}
              onChange={updateField("type")}
              placeholder="Ex.: Parque Nacional"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="editParkStatus" className="text-sm font-medium text-gray-600">
              Status
            </label>
            <Select
              id="editParkStatus"
              value={form?.status ?? "open"}
              onChange={updateField("status")}
            >
              {PARK_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="editParkDescription" className="text-sm font-medium text-gray-600">
              Descrição
            </label>
            <TextArea
              id="editParkDescription"
              value={form?.description ?? ""}
              onChange={updateField("description")}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="editParkArea" className="text-sm font-medium text-gray-600">
                Área (hectares)
              </label>
              <Input
                id="editParkArea"
                type="number"
                min={0}
                value={form?.areaHectares ?? ""}
                onChange={updateField("areaHectares")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="editParkAltitude" className="text-sm font-medium text-gray-600">
                Altitude (m)
              </label>
              <Input
                id="editParkAltitude"
                type="number"
                min={0}
                value={form?.altitudeMeters ?? ""}
                onChange={updateField("altitudeMeters")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="editParkHours" className="text-sm font-medium text-gray-600">
              Horário de funcionamento
            </label>
            <Input
              id="editParkHours"
              value={form?.openingHours ?? ""}
              onChange={updateField("openingHours")}
              placeholder="Ex.: Ter–Dom, 08h às 17h"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="editParkFee" className="text-sm font-medium text-gray-600">
              Taxa de entrada (centavos)
            </label>
            <Input
              id="editParkFee"
              type="number"
              min={0}
              value={form?.entranceFeeCents ?? ""}
              onChange={updateField("entranceFeeCents")}
            />
            <p className="text-xs text-gray-500">0 = gratuito</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="editParkBiodiversity" className="text-sm font-medium text-gray-600">
              Biodiversidade
            </label>
            <TextArea
              id="editParkBiodiversity"
              value={form?.biodiversity ?? ""}
              onChange={updateField("biodiversity")}
              rows={2}
              placeholder="Separados por vírgula"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="editParkHighlights" className="text-sm font-medium text-gray-600">
              Destaques
            </label>
            <TextArea
              id="editParkHighlights"
              value={form?.highlights ?? ""}
              onChange={updateField("highlights")}
              rows={2}
              placeholder="Separados por vírgula"
            />
          </div>
        </div>
        <ModalFooter
          onCancel={handleCloseEdit}
          onConfirm={handleSave}
          confirmLabel={updatePark.isPending ? "Salvando…" : "Salvar alterações"}
        />
      </Modal>
    </>
  );
}
