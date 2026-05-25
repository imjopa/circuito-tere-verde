import type { Park, ParkEventCategory, ParkEventStatus } from "@circuito/db/client";

import { EVENT_STATUS_OPTIONS } from "@/components/admin/AdminEventCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";

const CATEGORY_OPTIONS = [
  { value: "guided_trail", label: "Trilha guiada" },
  { value: "education", label: "Educação ambiental" },
  { value: "volunteer", label: "Voluntariado" },
  { value: "workshop", label: "Oficina" },
] as const;

export type EventFormState = {
  title: string;
  parkId: string;
  date: string;
  duration: string;
  category: ParkEventCategory;
  status: ParkEventStatus;
  spots: string;
  spotsLeft: string;
  description: string;
  priceCents: string;
  requirements: string;
};

interface EventFormFieldsProps {
  idPrefix: string;
  form: EventFormState;
  parks: Park[] | undefined;
  onFieldChange: (
    field: keyof EventFormState,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSpotsLeftChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EventFormFields({
  idPrefix,
  form,
  parks,
  onFieldChange,
  onSpotsLeftChange,
}: EventFormFieldsProps) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-title`} className="text-sm font-medium text-gray-600">
          Título
        </label>
        <Input id={`${idPrefix}-title`} value={form.title} onChange={onFieldChange("title")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-park`} className="text-sm font-medium text-gray-600">
          Parque
        </label>
        <Select id={`${idPrefix}-park`} value={form.parkId} onChange={onFieldChange("parkId")}>
          <option value="">Selecione um parque</option>
          {parks?.map((park) => (
            <option key={park.id} value={park.id}>
              {park.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${idPrefix}-date`} className="text-sm font-medium text-gray-600">
            Data
          </label>
          <Input
            id={`${idPrefix}-date`}
            type="date"
            value={form.date}
            onChange={onFieldChange("date")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${idPrefix}-duration`} className="text-sm font-medium text-gray-600">
            Duração
          </label>
          <Input
            id={`${idPrefix}-duration`}
            value={form.duration}
            onChange={onFieldChange("duration")}
            placeholder="Ex.: 4h"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${idPrefix}-category`} className="text-sm font-medium text-gray-600">
            Categoria
          </label>
          <Select
            id={`${idPrefix}-category`}
            value={form.category}
            onChange={onFieldChange("category")}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${idPrefix}-status`} className="text-sm font-medium text-gray-600">
            Status
          </label>
          <Select id={`${idPrefix}-status`} value={form.status} onChange={onFieldChange("status")}>
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
          <label htmlFor={`${idPrefix}-spots`} className="text-sm font-medium text-gray-600">
            Vagas totais
          </label>
          <Input
            id={`${idPrefix}-spots`}
            type="number"
            min={0}
            value={form.spots}
            onChange={onFieldChange("spots")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${idPrefix}-spotsLeft`} className="text-sm font-medium text-gray-600">
            Vagas restantes
          </label>
          <Input
            id={`${idPrefix}-spotsLeft`}
            type="number"
            min={0}
            max={form.spots ? Number(form.spots) : undefined}
            value={form.spotsLeft}
            onChange={onSpotsLeftChange ?? onFieldChange("spotsLeft")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-price`} className="text-sm font-medium text-gray-600">
          Preço (centavos)
        </label>
        <Input
          id={`${idPrefix}-price`}
          type="number"
          min={0}
          value={form.priceCents}
          onChange={onFieldChange("priceCents")}
        />
        <p className="text-xs text-gray-500">0 = gratuito</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-description`} className="text-sm font-medium text-gray-600">
          Descrição
        </label>
        <TextArea
          id={`${idPrefix}-description`}
          value={form.description}
          onChange={onFieldChange("description")}
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-requirements`} className="text-sm font-medium text-gray-600">
          Requisitos
        </label>
        <TextArea
          id={`${idPrefix}-requirements`}
          value={form.requirements}
          onChange={onFieldChange("requirements")}
          rows={2}
          placeholder="Separados por vírgula"
        />
      </div>
    </>
  );
}
