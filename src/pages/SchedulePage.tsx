import { useState } from "react";
import {
  Accessibility,
  Backpack,
  CircleCheck,
  ClipboardList,
  Clock,
  Users,
  type LucideIcon,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import { parks } from "../data/parks";
import { formInput, formSelect, formTextarea } from "../lib/variants/input";

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

const labelClass = "text-[0.8125rem] font-medium text-gray-600";

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

export default function SchedulePage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Nome obrigatório.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "E-mail inválido.";
    if (!form.parkId) newErrors.parkId = "Selecione um parque.";
    if (!form.date) newErrors.date = "Selecione uma data.";
    if (!form.time) newErrors.time = "Selecione um horário.";
    if (form.visitors < 1 || form.visitors > 20) newErrors.visitors = "Entre 1 e 20 visitantes.";
    return newErrors;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitted(false);
  }

  const selectedPark = parks.find((p) => p.id === form.parkId);

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
        <main className="mx-auto max-w-[1200px] px-6 py-8">
          <div className="mx-auto my-12 flex max-w-[520px] flex-col items-center gap-3 rounded-xl border border-gray-100 bg-white p-10 text-center">
            <CircleCheck className="size-14 text-green-600" aria-hidden />
            <h2 className="text-2xl text-green-800">Agendamento confirmado!</h2>
            <p className="text-[0.9375rem] text-gray-500">Seu pedido foi registrado com sucesso.</p>
            <div className="my-3 grid w-full grid-cols-2 gap-3 text-left">
              <div className="flex flex-col gap-0.5 rounded-lg bg-green-50 px-3.5 py-2.5">
                <span className="text-[0.6875rem] uppercase tracking-wider text-gray-500">
                  Visitante
                </span>
                <strong className="text-sm text-gray-900">{form.name}</strong>
              </div>
              <div className="flex flex-col gap-0.5 rounded-lg bg-green-50 px-3.5 py-2.5">
                <span className="text-[0.6875rem] uppercase tracking-wider text-gray-500">
                  Parque
                </span>
                <strong className="text-sm text-gray-900">{selectedPark?.name}</strong>
              </div>
              <div className="flex flex-col gap-0.5 rounded-lg bg-green-50 px-3.5 py-2.5">
                <span className="text-[0.6875rem] uppercase tracking-wider text-gray-500">
                  Data
                </span>
                <strong className="text-sm text-gray-900">{formattedDate}</strong>
              </div>
              <div className="flex flex-col gap-0.5 rounded-lg bg-green-50 px-3.5 py-2.5">
                <span className="text-[0.6875rem] uppercase tracking-wider text-gray-500">
                  Horário
                </span>
                <strong className="text-sm text-gray-900">{form.time}</strong>
              </div>
              <div className="flex flex-col gap-0.5 rounded-lg bg-green-50 px-3.5 py-2.5">
                <span className="text-[0.6875rem] uppercase tracking-wider text-gray-500">
                  Visitantes
                </span>
                <strong className="text-sm text-gray-900">
                  {form.visitors} pessoa{form.visitors > 1 ? "s" : ""}
                </strong>
              </div>
              <div className="flex flex-col gap-0.5 rounded-lg bg-green-50 px-3.5 py-2.5">
                <span className="text-[0.6875rem] uppercase tracking-wider text-gray-500">
                  Confirmação
                </span>
                <strong className="text-sm text-gray-900">{form.email}</strong>
              </div>
            </div>
            <p className="max-w-[380px] text-center text-[0.8125rem] leading-relaxed text-gray-500">
              Uma confirmação será enviada para <strong>{form.email}</strong>. Apresente este
              agendamento na entrada do parque.
            </p>
            <button
              onClick={handleReset}
              className="mt-2 rounded-lg bg-green-700 px-7 py-3 text-[0.9375rem] font-medium text-white transition hover:bg-green-800"
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
        <div className="mx-auto max-w-[1200px]">
          <h1 className="text-[1.75rem] text-white">Agendamento de visita</h1>
          <p className="mt-1 text-sm text-white/65">
            Reserve sua entrada com antecedência e garanta sua vaga
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-[1200px] px-6 py-8">
        <div className="grid grid-cols-[1fr_320px] items-start gap-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
            <fieldset className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-5">
              <legend className="px-2 font-display text-sm font-medium text-green-800">
                Dados do visitante
              </legend>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-[5px]">
                  <label htmlFor="name" className={labelClass}>
                    Nome completo *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className={formInput({ error: !!errors.name })}
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
                <div className="flex flex-col gap-[5px]">
                  <label htmlFor="email" className={labelClass}>
                    E-mail *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className={formInput({ error: !!errors.email })}
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <span className="mt-0.5 text-xs text-red-600" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-[5px]">
                  <label htmlFor="phone" className={labelClass}>
                    Telefone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className={formInput()}
                    placeholder="(21) 00000-0000"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-5">
              <legend className="px-2 font-display text-sm font-medium text-green-800">
                Detalhes da visita
              </legend>
              <div className="flex flex-col gap-[5px]">
                <label htmlFor="parkId" className={labelClass}>
                  Parque *
                </label>
                <select
                  id="parkId"
                  name="parkId"
                  value={form.parkId}
                  onChange={handleChange}
                  className={formSelect({ error: !!errors.parkId })}
                >
                  <option value="">Selecione o parque</option>
                  {parks.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.type}
                    </option>
                  ))}
                </select>
                {errors.parkId && (
                  <span className="mt-0.5 text-xs text-red-600" role="alert">
                    {errors.parkId}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-[5px]">
                  <label htmlFor="date" className={labelClass}>
                    Data *
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    min={getTodayString()}
                    className={formInput({ error: !!errors.date })}
                  />
                  {errors.date && (
                    <span className="mt-0.5 text-xs text-red-600" role="alert">
                      {errors.date}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-[5px]">
                  <label htmlFor="time" className={labelClass}>
                    Horário *
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className={formSelect({ error: !!errors.time })}
                  >
                    <option value="">Selecione</option>
                    {VISIT_TIMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.time && (
                    <span className="mt-0.5 text-xs text-red-600" role="alert">
                      {errors.time}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-[5px]">
                <label htmlFor="visitors" className={labelClass}>
                  Número de visitantes *
                </label>
                <input
                  id="visitors"
                  name="visitors"
                  type="number"
                  min={1}
                  max={20}
                  value={form.visitors}
                  onChange={handleChange}
                  className={formInput({ error: !!errors.visitors })}
                />
                {errors.visitors && (
                  <span className="mt-0.5 text-xs text-red-600" role="alert">
                    {errors.visitors}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-[5px]">
                <label htmlFor="notes" className={labelClass}>
                  Observações
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  className={formTextarea()}
                  placeholder="Necessidades especiais, grupo escolar, etc."
                />
              </div>
            </fieldset>

            {selectedPark && (
              <div className="rounded-lg border border-green-100 bg-green-50 px-4 py-3.5">
                <p className="text-[0.9375rem] font-medium text-green-800">{selectedPark.name}</p>
                <p className="mt-0.5 text-[0.8125rem] text-gray-500">
                  {selectedPark.openingHours} · Entrada: {selectedPark.entranceFee}
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

          <aside className="sticky top-20 flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-5">
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
                  <p className="text-[0.8125rem] font-medium text-gray-700">{item.title}</p>
                  <p className="mt-px text-[0.8125rem] leading-normal text-gray-500">{item.text}</p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </main>
    </div>
  );
}
