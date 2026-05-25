import type { Park, TrailDifficulty, TrailStatus } from "@circuito/db/client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";

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

export type TrailFormState = {
  name: string;
  parkId: string;
  difficulty: TrailDifficulty;
  distanceMeters: string;
  duration: string;
  altitudeMeters: string;
  status: TrailStatus;
  description: string;
  conditions: string;
  tips: string;
};

interface TrailFormFieldsProps {
  idPrefix: string;
  form: TrailFormState;
  parks: Park[] | undefined;
  onFieldChange: (
    field: keyof TrailFormState,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function TrailFormFields({ idPrefix, form, parks, onFieldChange }: TrailFormFieldsProps) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-name`} className="text-sm font-medium text-gray-600">
          Nome
        </label>
        <Input id={`${idPrefix}-name`} value={form.name} onChange={onFieldChange("name")} />
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
          <label htmlFor={`${idPrefix}-difficulty`} className="text-sm font-medium text-gray-600">
            Dificuldade
          </label>
          <Select
            id={`${idPrefix}-difficulty`}
            value={form.difficulty}
            onChange={onFieldChange("difficulty")}
          >
            {DIFFICULTY_OPTIONS.map((opt) => (
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
          <label htmlFor={`${idPrefix}-distance`} className="text-sm font-medium text-gray-600">
            Distância (m)
          </label>
          <Input
            id={`${idPrefix}-distance`}
            type="number"
            min={0}
            value={form.distanceMeters}
            onChange={onFieldChange("distanceMeters")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${idPrefix}-altitude`} className="text-sm font-medium text-gray-600">
            Altitude (m)
          </label>
          <Input
            id={`${idPrefix}-altitude`}
            type="number"
            min={0}
            value={form.altitudeMeters}
            onChange={onFieldChange("altitudeMeters")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-duration`} className="text-sm font-medium text-gray-600">
          Duração
        </label>
        <Input
          id={`${idPrefix}-duration`}
          value={form.duration}
          onChange={onFieldChange("duration")}
          placeholder="Ex.: 5–6h"
        />
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
        <label htmlFor={`${idPrefix}-conditions`} className="text-sm font-medium text-gray-600">
          Condições atuais
        </label>
        <TextArea
          id={`${idPrefix}-conditions`}
          value={form.conditions}
          onChange={onFieldChange("conditions")}
          rows={2}
          placeholder="Descreva as condições atuais da trilha..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-tips`} className="text-sm font-medium text-gray-600">
          Dicas
        </label>
        <TextArea
          id={`${idPrefix}-tips`}
          value={form.tips}
          onChange={onFieldChange("tips")}
          rows={2}
          placeholder="Separados por vírgula"
        />
      </div>
    </>
  );
}
