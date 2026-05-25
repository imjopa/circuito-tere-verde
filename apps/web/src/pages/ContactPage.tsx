import { Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import { useCallback, useState } from "react";

import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { SuccessPanel } from "@/components/ui/SuccessPanel";
import { TextArea } from "@/components/ui/TextArea";

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

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    [errors],
  );

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Nome obrigatório.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "E-mail inválido.";
    if (!form.subject.trim()) errs.subject = "Assunto obrigatório.";
    if (!form.message.trim() || form.message.length < 10) errs.message = "Mensagem muito curta.";
    return errs;
  }, [form]);

  const handleSubmit = useCallback(
    (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
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

  return (
    <PageLayout
      title="Contato"
      subtitle="Fale conosco — estamos aqui para ajudar"
      mainClassName="mx-auto max-w-6xl px-6 py-8"
    >
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
                <p className="text-xs tracking-wider text-gray-500 uppercase">{c.label}</p>
                <p className="mt-0.5 text-sm font-medium text-gray-900">{c.value}</p>
                <p className="mt-px text-xs text-gray-500">{c.sub}</p>
              </div>
            </div>
          ))}
        </aside>

        <div className="min-w-0 flex-1 rounded-lg border border-gray-100 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-green-800">Envie uma mensagem</h2>

          {submitted ? (
            <SuccessPanel
              title="Mensagem enviada!"
              description={
                <>
                  Obrigado, {form.name}. Retornaremos em breve para {form.email}.
                </>
              }
              onReset={handleReset}
              resetLabel="Enviar outra mensagem"
              className="flex flex-col items-center gap-3 px-4 py-10 text-center"
            />
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <FormField id="name" label="Nome" error={errors.name ?? ""} required>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    placeholder="Seu nome"
                  />
                </FormField>
                <FormField id="email" label="E-mail" error={errors.email ?? ""} required>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    placeholder="seu@email.com"
                  />
                </FormField>
              </div>
              <FormField id="subject" label="Assunto" error={errors.subject ?? ""} required>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  error={!!errors.subject}
                  placeholder="Sobre o que você quer falar?"
                />
              </FormField>
              <FormField id="message" label="Mensagem" error={errors.message ?? ""} required>
                <TextArea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  error={!!errors.message}
                  placeholder="Escreva sua mensagem aqui..."
                />
              </FormField>
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
    </PageLayout>
  );
}
