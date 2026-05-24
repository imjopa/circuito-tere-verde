import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { TextArea } from "@/components/ui/TextArea";
import { CircleCheck, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { useState } from "react";

const CONTACTS: { icon: LucideIcon; label: string; value: string; sub: string }[] = [
  { icon: Phone, label: "Telefone geral", value: "(21) 0000-0000", sub: "Seg–Sex, 08h às 17h" },
  { icon: Mail, label: "E-mail", value: "contato@tereverde.com.br", sub: "Resposta em até 48h" },
  {
    icon: MapPin,
    label: "Endereço",
    value: "Av. Alberto Torres, 111 — Alto — Teresópolis, RJ",
    sub: "CEP 25964-004",
  },
  { icon: MessageCircle, label: "WhatsApp", value: "(21) 00000-0000", sub: "Seg–Sex, 08h às 17h" },
];

const INITIAL_FORM = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Nome obrigatório.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "E-mail inválido.";
    if (!form.subject.trim()) errs.subject = "Assunto obrigatório.";
    if (!form.message.trim() || form.message.length < 10) errs.message = "Mensagem muito curta.";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="bg-green-700 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl text-white">Contato</h1>
          <p className="mt-1 text-sm text-white/65">Fale conosco — estamos aqui para ajudar</p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          <aside className="flex w-full shrink-0 flex-col gap-3 lg:w-80">
            <h2 className="mb-4 text-lg font-medium text-green-800">Canais de atendimento</h2>
            {CONTACTS.map((c) => (
              <div
                key={c.label}
                className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-4"
              >
                <c.icon className="size-5 shrink-0 text-green-700" aria-hidden />
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">{c.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-gray-900">{c.value}</p>
                  <p className="mt-px text-xs text-gray-500">{c.sub}</p>
                </div>
              </div>
            ))}
          </aside>

          <div className="min-w-0 flex-1 rounded-lg border border-gray-100 bg-white p-6">
            <h2 className="mb-4 text-lg font-medium text-green-800">Envie uma mensagem</h2>

            {submitted ? (
              <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
                <CircleCheck className="size-14 text-green-600" aria-hidden />
                <h3 className="text-xl text-green-800">Mensagem enviada!</h3>
                <p className="max-w-sm text-sm leading-relaxed text-gray-500">
                  Obrigado, {form.name}. Retornaremos em breve para {form.email}.
                </p>
                <button
                  onClick={() => {
                    setForm(INITIAL_FORM);
                    setSubmitted(false);
                  }}
                  className="mt-2 rounded-lg bg-green-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-green-800"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name">Nome *</Label>
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
                      <span className="text-xs text-red-600" role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>
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
                      <span className="text-xs text-red-600" role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="subject">Assunto *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    error={!!errors.subject}
                    placeholder="Sobre o que você quer falar?"
                  />
                  {errors.subject && (
                    <span className="text-xs text-red-600" role="alert">
                      {errors.subject}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="message">Mensagem *</Label>
                  <TextArea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    error={!!errors.message}
                    placeholder="Escreva sua mensagem aqui..."
                  />
                  {errors.message && (
                    <span className="text-xs text-red-600" role="alert">
                      {errors.message}
                    </span>
                  )}
                </div>
                <Button
                  type="submit"
                  className="rounded-lg bg-green-700 py-3 text-sm font-medium text-white transition hover:bg-green-800"
                >
                  Enviar mensagem
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
