import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import styles from "./ContactPage.module.css";

const CONTACTS = [
  { icon: "📞", label: "Telefone geral", value: "(21) 0000-0000", sub: "Seg–Sex, 08h às 17h" },
  { icon: "📧", label: "E-mail", value: "contato@tereverde.com.br", sub: "Resposta em até 48h" },
  {
    icon: "📍",
    label: "Endereço",
    value: "Av. Alberto Torres, 111 — Alto — Teresópolis, RJ",
    sub: "CEP 25964-004",
  },
  { icon: "📱", label: "WhatsApp", value: "(21) 00000-0000", sub: "Seg–Sex, 08h às 17h" },
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
    <div className={styles.page}>
      <Navbar />
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderContent}>
          <h1 className={styles.pageTitle}>Contato</h1>
          <p className={styles.pageSubtitle}>Fale conosco — estamos aqui para ajudar</p>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.layout}>
          {/* Canais de contato */}
          <aside className={styles.contactCards}>
            <h2 className={styles.sectionTitle}>Canais de atendimento</h2>
            {CONTACTS.map((c) => (
              <div key={c.label} className={styles.contactCard}>
                <span className={styles.contactIcon}>{c.icon}</span>
                <div>
                  <p className={styles.contactLabel}>{c.label}</p>
                  <p className={styles.contactValue}>{c.value}</p>
                  <p className={styles.contactSub}>{c.sub}</p>
                </div>
              </div>
            ))}
          </aside>

          {/* Formulário */}
          <div className={styles.formArea}>
            <h2 className={styles.sectionTitle}>Envie uma mensagem</h2>

            {submitted ? (
              <div className={styles.successCard}>
                <div className={styles.successIcon}>✅</div>
                <h3 className={styles.successTitle}>Mensagem enviada!</h3>
                <p className={styles.successText}>
                  Obrigado, {form.name}. Retornaremos em breve para {form.email}.
                </p>
                <button
                  onClick={() => {
                    setForm(INITIAL_FORM);
                    setSubmitted(false);
                  }}
                  className={styles.backBtn}
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <div className={styles.fieldRow2}>
                  <div className={styles.field}>
                    <label htmlFor="name" className={styles.label}>
                      Nome *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                      placeholder="Seu nome"
                    />
                    {errors.name && (
                      <span className={styles.error} role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="email" className={styles.label}>
                      E-mail *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <span className={styles.error} role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.field}>
                  <label htmlFor="subject" className={styles.label}>
                    Assunto *
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.subject ? styles.inputError : ""}`}
                    placeholder="Sobre o que você quer falar?"
                  />
                  {errors.subject && (
                    <span className={styles.error} role="alert">
                      {errors.subject}
                    </span>
                  )}
                </div>
                <div className={styles.field}>
                  <label htmlFor="message" className={styles.label}>
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
                    placeholder="Escreva sua mensagem aqui..."
                  />
                  {errors.message && (
                    <span className={styles.error} role="alert">
                      {errors.message}
                    </span>
                  )}
                </div>
                <button type="submit" className={styles.submitBtn}>
                  Enviar mensagem
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
