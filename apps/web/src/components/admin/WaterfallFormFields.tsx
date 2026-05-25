import type { WaterfallAccess } from "@circuito/db/client";
import type { Park } from "@circuito/db/client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";

const ACCESS_OPTIONS = [
  { value: "easy", label: "Fácil" },
  { value: "medium", label: "Médio" },
  { value: "hard", label: "Difícil" },
] as const;

export type WaterfallFormState = {
  name: string;
  parkId: string;
  heightMeters: string;
  access: WaterfallAccess;
  allowsBathing: boolean;
  description: string;
  accessibility: string;
  howToGet: string;
  tips: string;
};

interface WaterfallFormFieldsProps {
  idPrefix: string;
  form: WaterfallFormState;
  parks: Park[] | undefined;
  onFieldChange: (
    field: keyof WaterfallFormState,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function WaterfallFormFields({
  idPrefix,
  form,
  parks,
  onFieldChange,
}: WaterfallFormFieldsProps) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-name`} className="text-sm font-medium text-gray-600">
          Nome
        </label>
        <Input
          id={`${idPrefix}-name`}
          value={form.name}
          onChange={onFieldChange("name")}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-park`} className="text-sm font-medium text-gray-600">
          Parque
        </label>
        <Select
          id={`${idPrefix}-park`}
          value={form.parkId}
          onChange={onFieldChange("parkId")}
          required
        >
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
          <label htmlFor={`${idPrefix}-height`} className="text-sm font-medium text-gray-600">
            Altura (m)
          </label>
          <Input
            id={`${idPrefix}-height`}
            type="number"
            min={0}
            value={form.heightMeters}
            onChange={onFieldChange("heightMeters")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${idPrefix}-access`} className="text-sm font-medium text-gray-600">
            Acesso
          </label>
          <Select id={`${idPrefix}-access`} value={form.access} onChange={onFieldChange("access")}>
            {ACCESS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id={`${idPrefix}-bathing`}
          type="checkbox"
          checked={form.allowsBathing}
          onChange={onFieldChange("allowsBathing")}
          className="size-4"
          aria-label="Permite banho"
        />
        <label htmlFor={`${idPrefix}-bathing`} className="text-sm text-gray-700">
          Permite banho
        </label>
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
        <label htmlFor={`${idPrefix}-accessibility`} className="text-sm font-medium text-gray-600">
          Acessibilidade
        </label>
        <TextArea
          id={`${idPrefix}-accessibility`}
          value={form.accessibility}
          onChange={onFieldChange("accessibility")}
          rows={2}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-howToGet`} className="text-sm font-medium text-gray-600">
          Como chegar
        </label>
        <TextArea
          id={`${idPrefix}-howToGet`}
          value={form.howToGet}
          onChange={onFieldChange("howToGet")}
          rows={2}
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
