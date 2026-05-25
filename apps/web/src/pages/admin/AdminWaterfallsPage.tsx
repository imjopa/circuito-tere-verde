import type { NewWaterfall, Park, Waterfall, WaterfallAccess } from "@circuito/db/client";
import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { Input } from "@/components/ui/Input";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { LoadingMessage } from "@/components/ui/QueryFeedback";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { useParks } from "@/hooks/data/useParks";
import { useWaterfalls } from "@/hooks/data/useWaterfalls";
import { parseCommaList } from "@/lib/admin-form-utils";
import { queryClient } from "@/lib/query-client";

const ACCESS_OPTIONS = [
  { value: "easy", label: "Fácil" },
  { value: "medium", label: "Médio" },
  { value: "hard", label: "Difícil" },
] as const;

const EMPTY_FORM = {
  name: "",
  parkId: "",
  heightMeters: "",
  access: "easy" as WaterfallAccess,
  allowsBathing: true,
  description: "",
  accessibility: "",
  howToGet: "",
  tips: "",
};

export default function AdminWaterfallsPage() {
  const waterfalls = useWaterfalls();
  const parks = useParks();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const createWaterfall = useMutation({
    mutationFn: (data: NewWaterfall) =>
      ky.post("/api/waterfalls", { json: data }).json<Waterfall>(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["waterfalls"] });
      setShowCreate(false);
      setForm(EMPTY_FORM);
      setError(null);
    },
    onError: () =>
      setError("Não foi possível criar a cachoeira. Verifique os dados e tente novamente."),
  });

  const updateField = useCallback(
    (field: keyof typeof EMPTY_FORM) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value =
          e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
      },
    [],
  );

  const handleSubmit = useCallback(async () => {
    const park = parks.data?.find((p) => p.id === form.parkId);
    if (!form.name.trim() || !park) {
      setError("Preencha o nome e selecione um parque.");
      return;
    }

    setError(null);
    await createWaterfall.mutateAsync({
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
    });
  }, [form, parks.data, createWaterfall]);

  const handleClose = useCallback(() => {
    setShowCreate(false);
    setForm(EMPTY_FORM);
    setError(null);
  }, []);

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
              <WaterfallCard key={wf.id} waterfall={wf} />
            ))}
          </div>
        </section>
      )}

      <Modal
        open={showCreate}
        title="Nova cachoeira"
        onClose={handleClose}
        ariaLabel="Nova cachoeira"
      >
        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto pr-1">
          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="wfName" className="text-sm font-medium text-gray-600">
              Nome
            </label>
            <Input id="wfName" value={form.name} onChange={updateField("name")} required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="wfPark" className="text-sm font-medium text-gray-600">
              Parque
            </label>
            <Select id="wfPark" value={form.parkId} onChange={updateField("parkId")} required>
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
              <label htmlFor="wfHeight" className="text-sm font-medium text-gray-600">
                Altura (m)
              </label>
              <Input
                id="wfHeight"
                type="number"
                min={0}
                value={form.heightMeters}
                onChange={updateField("heightMeters")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="wfAccess" className="text-sm font-medium text-gray-600">
                Acesso
              </label>
              <Select id="wfAccess" value={form.access} onChange={updateField("access")}>
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
              id="wfBathing"
              type="checkbox"
              checked={form.allowsBathing}
              onChange={updateField("allowsBathing")}
              className="size-4"
              aria-label="Permite banho"
            />
            <label htmlFor="wfBathing" className="text-sm text-gray-700">
              Permite banho
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="wfDescription" className="text-sm font-medium text-gray-600">
              Descrição
            </label>
            <TextArea
              id="wfDescription"
              value={form.description}
              onChange={updateField("description")}
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="wfAccessibility" className="text-sm font-medium text-gray-600">
              Acessibilidade
            </label>
            <TextArea
              id="wfAccessibility"
              value={form.accessibility}
              onChange={updateField("accessibility")}
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="wfHowToGet" className="text-sm font-medium text-gray-600">
              Como chegar
            </label>
            <TextArea
              id="wfHowToGet"
              value={form.howToGet}
              onChange={updateField("howToGet")}
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="wfTips" className="text-sm font-medium text-gray-600">
              Dicas
            </label>
            <TextArea
              id="wfTips"
              value={form.tips}
              onChange={updateField("tips")}
              rows={2}
              placeholder="Separados por vírgula"
            />
          </div>
        </div>
        <ModalFooter
          onCancel={handleClose}
          onConfirm={handleSubmit}
          confirmLabel={createWaterfall.isPending ? "Salvando…" : "Criar cachoeira"}
        />
      </Modal>
    </>
  );
}

function WaterfallCard({ waterfall }: { waterfall: Waterfall & { park: Park } }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white px-5 py-4 transition hover:shadow-sm">
      <p className="text-sm font-medium text-gray-900">{waterfall.name}</p>
      <p className="text-sm text-gray-500">
        {waterfall.parkName} · {waterfall.heightMeters} m ·{" "}
        {waterfall.allowsBathing ? "Permite banho" : "Sem banho"}
      </p>
    </div>
  );
}
