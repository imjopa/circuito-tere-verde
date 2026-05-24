import {
  Accessibility,
  Backpack,
  CircleCheck,
  ClipboardList,
  Clock,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { useParks } from "@/hooks/data/useParks";

const VISIT_TIMES = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  parkId: "",
  date: "",
  time: "",
  visitors: 1,
  notes: "",
};

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

export default function SchedulePage() {
  const parks = useParks();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    [errors],
  );

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Nome obrigatório.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "E-mail inválido.";
    if (!form.parkId) newErrors.parkId = "Selecione um parque.";
    if (!form.date) newErrors.date = "Selecione uma data.";
    if (!form.time) newErrors.time = "Selecione um horário.";
    if (form.visitors < 1 || form.visitors > 20) newErrors.visitors = "Entre 1 e 20 visitantes.";
    return newErrors;
  }, [form]);

  const handleSubmit = useCallback(
    (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setSubmitted(true);
    },
    [validate],
  );

  const handleReset = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitted(false);
  }, []);

  const selectedPark = parks.data?.find((p) => p.id === form.parkId);

  if (submitted) {
    const evDate = new Date(form.date + "T00:00:00");
    const formattedDate = evDate.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-8">
          <div className="mx-auto my-12 flex max-w-lg flex-col items-center gap-3 rounded-xl border border-gray-100 bg-white p-10 text-center">
            <CircleCheck className="size-14 text-green-600" aria-hidden />
            <h2 className="text-2xl text-green-800">Agendamento confirmado!</h2>
            <p className="text-sm text-gray-500">Seu pedido foi registrado com sucesso.</p>
            <div className="my-3 grid w-full grid-cols-2 gap-3 text-left">
              <div className="flex flex-col gap-0.5 rounded-lg bg-green-50 px-3.5 py-2.5">
                <span className="text-xs tracking-wider text-gray-500 uppercase">Visitante</span>
                <strong className="text-sm text-gray-900">{form.name}</strong>
              </div>
              <div className="flex flex-col gap-0.5 rounded-lg bg-green-50 px-3.5 py-2.5">
                <span className="text-xs tracking-wider text-gray-500 uppercase">Parque</span>
                <strong className="text-sm text-gray-900">{selectedPark?.name}</strong>
              </div>
              <div className="flex flex-col gap-0.5 rounded-lg bg-green-50 px-3.5 py-2.5">
                <span className="text-xs tracking-wider text-gray-500 uppercase">Data</span>
                <strong className="text-sm text-gray-900">{formattedDate}</strong>
              </div>
              <div className="flex flex-col gap-0.5 rounded-lg bg-green-50 px-3.5 py-2.5">
                <span className="text-xs tracking-wider text-gray-500 uppercase">Horário</span>
                <strong className="text-sm text-gray-900">{form.time}</strong>
              </div>
              <div className="flex flex-col gap-0.5 rounded-lg bg-green-50 px-3.5 py-2.5">
                <span className="text-xs tracking-wider text-gray-500 uppercase">Visitantes</span>
                <strong className="text-sm text-gray-900">
                  {form.visitors} pessoa{form.visitors > 1 ? "s" : ""}
                </strong>
              </div>
              <div className="flex flex-col gap-0.5 rounded-lg bg-green-50 px-3.5 py-2.5">
                <span className="text-xs tracking-wider text-gray-500 uppercase">Confirmação</span>
                <strong className="text-sm text-gray-900">{form.email}</strong>
              </div>
            </div>
            <p className="max-w-sm text-center text-sm leading-relaxed text-gray-500">
              Uma confirmação será enviada para <strong>{form.email}</strong>. Apresente este
              agendamento na entrada do parque.
            </p>
            <button
              onClick={handleReset}
              className="mt-2 rounded-lg bg-green-700 px-7 py-3 text-sm font-medium text-white transition hover:bg-green-800"
            >
              Fazer novo agendamento
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="bg-green-700 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl text-white">Agendamento de visita</h1>
          <p className="mt-1 text-sm text-white/65">
            Reserve sua entrada com antecedência e garanta sua vaga
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          <form onSubmit={handleSubmit} className="flex min-w-0 flex-1 flex-col gap-6" noValidate>
            <fieldset className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-5">
              <legend className="font-display px-2 text-sm font-medium text-green-800">
                Dados do visitante
              </legend>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    placeholder="Seu nome"
                  />
                  {errors.name && (
                    <span className="mt-0.5 text-xs text-red-600" role="alert">
                      {errors.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <span className="mt-0.5 text-xs text-red-600" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    placeholder="(21) 00000-0000"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-5">
              <legend className="font-display px-2 text-sm font-medium text-green-800">
                Detalhes da visita
              </legend>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="parkId">Parque *</Label>
                <Select
                  id="parkId"
                  name="parkId"
                  value={form.parkId}
                  onChange={handleChange}
                  error={!!errors.parkId}
                >
                  <option value="">Selecione o parque</option>
                  {parks.data?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.type}
                    </option>
                  ))}
                </Select>
                {errors.parkId && (
                  <span className="mt-0.5 text-xs text-red-600" role="alert">
                    {errors.parkId}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    min={getTodayString()}
                    error={!!errors.date}
                  />
                  {errors.date && (
                    <span className="mt-0.5 text-xs text-red-600" role="alert">
                      {errors.date}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="time">Horário *</Label>
                  <Select
                    id="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    error={!!errors.time}
                  >
                    <option value="">Selecione</option>
                    {VISIT_TIMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                  {errors.time && (
                    <span className="mt-0.5 text-xs text-red-600" role="alert">
                      {errors.time}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="visitors">Número de visitantes *</Label>
                <Input
                  id="visitors"
                  name="visitors"
                  type="number"
                  min={1}
                  max={20}
                  value={form.visitors}
                  onChange={handleChange}
                  error={!!errors.visitors}
                />
                {errors.visitors && (
                  <span className="mt-0.5 text-xs text-red-600" role="alert">
                    {errors.visitors}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="notes">Observações</Label>
                <TextArea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  error={!!errors.notes}
                  placeholder="Necessidades especiais, grupo escolar, etc."
                />
              </div>
            </fieldset>

            {selectedPark && (
              <div className="rounded-lg border border-green-100 bg-green-50 px-4 py-3.5">
                <p className="text-sm font-medium text-green-800">{selectedPark.name}</p>
                <p className="mt-0.5 text-sm text-gray-500">
                  {selectedPark.openingHours} · Entrada:{" "}
                  {(selectedPark.entranceFeeCents / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="rounded-lg bg-green-700 py-3.5 text-base font-medium text-white transition hover:bg-green-800"
            >
              Confirmar agendamento
            </button>
          </form>

          <aside className="sticky top-20 flex w-full shrink-0 flex-col gap-4 rounded-lg border border-gray-100 bg-white p-5 lg:order-last lg:w-80">
            <h2 className="mb-1 text-base font-medium text-green-800">Informações importantes</h2>
            {(
              [
                {
                  icon: Clock,
                  title: "Antecedência",
                  text: "Agende com pelo menos 24h de antecedência.",
                },
                {
                  icon: Users,
                  title: "Grupos",
                  text: "Grupos acima de 10 pessoas entram em contato direto.",
                },
                {
                  icon: Backpack,
                  title: "O que levar",
                  text: "Água, protetor solar, calçado fechado e documento com foto.",
                },
                {
                  icon: ClipboardList,
                  title: "Regras gerais",
                  text: "Proibido fogueira, som alto e descarte de lixo nas trilhas.",
                },
                {
                  icon: Accessibility,
                  title: "Acessibilidade",
                  text: "Informe necessidades especiais no campo de observações.",
                },
              ] satisfies { icon: LucideIcon; title: string; text: string }[]
            ).map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <item.icon className="mt-px size-5 shrink-0 text-green-700" aria-hidden />
                <div>
                  <p className="text-sm font-medium text-gray-700">{item.title}</p>
                  <p className="mt-px text-sm leading-normal text-gray-500">{item.text}</p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </main>
    </div>
  );
}
