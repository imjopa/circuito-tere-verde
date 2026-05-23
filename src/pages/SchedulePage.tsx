import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import { parks } from "../data/parks";
import styles from "./SchedulePage.module.css";

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
      <div className={styles.page}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✅</div>
            <h2 className={styles.successTitle}>Agendamento confirmado!</h2>
            <p className={styles.successSub}>Seu pedido foi registrado com sucesso.</p>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span>Visitante</span>
                <strong>{form.name}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Parque</span>
                <strong>{selectedPark?.name}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Data</span>
                <strong>{formattedDate}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Horário</span>
                <strong>{form.time}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Visitantes</span>
                <strong>
                  {form.visitors} pessoa{form.visitors > 1 ? "s" : ""}
                </strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Confirmação</span>
                <strong>{form.email}</strong>
              </div>
            </div>
            <p className={styles.successNote}>
              Uma confirmação será enviada para <strong>{form.email}</strong>. Apresente este
              agendamento na entrada do parque.
            </p>
            <button onClick={handleReset} className={styles.newScheduleBtn}>
              Fazer novo agendamento
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderContent}>
          <h1 className={styles.pageTitle}>Agendamento de visita</h1>
          <p className={styles.pageSubtitle}>
            Reserve sua entrada com antecedência e garanta sua vaga
          </p>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.formLayout}>
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Dados do visitante</legend>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label htmlFor="name" className={styles.label}>
                    Nome completo *
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
              </div>
              <div className={styles.fieldRow2}>
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
                <div className={styles.field}>
                  <label htmlFor="phone" className={styles.label}>
                    Telefone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="(21) 00000-0000"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Detalhes da visita</legend>
              <div className={styles.field}>
                <label htmlFor="parkId" className={styles.label}>
                  Parque *
                </label>
                <select
                  id="parkId"
                  name="parkId"
                  value={form.parkId}
                  onChange={handleChange}
                  className={`${styles.select} ${errors.parkId ? styles.inputError : ""}`}
                >
                  <option value="">Selecione o parque</option>
                  {parks.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.type}
                    </option>
                  ))}
                </select>
                {errors.parkId && (
                  <span className={styles.error} role="alert">
                    {errors.parkId}
                  </span>
                )}
              </div>

              <div className={styles.fieldRow2}>
                <div className={styles.field}>
                  <label htmlFor="date" className={styles.label}>
                    Data *
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    min={getTodayString()}
                    className={`${styles.input} ${errors.date ? styles.inputError : ""}`}
                  />
                  {errors.date && (
                    <span className={styles.error} role="alert">
                      {errors.date}
                    </span>
                  )}
                </div>
                <div className={styles.field}>
                  <label htmlFor="time" className={styles.label}>
                    Horário *
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className={`${styles.select} ${errors.time ? styles.inputError : ""}`}
                  >
                    <option value="">Selecione</option>
                    {VISIT_TIMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.time && (
                    <span className={styles.error} role="alert">
                      {errors.time}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="visitors" className={styles.label}>
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
                  className={`${styles.input} ${errors.visitors ? styles.inputError : ""}`}
                />
                {errors.visitors && (
                  <span className={styles.error} role="alert">
                    {errors.visitors}
                  </span>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="notes" className={styles.label}>
                  Observações
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  className={styles.textarea}
                  placeholder="Necessidades especiais, grupo escolar, etc."
                />
              </div>
            </fieldset>

            {selectedPark && (
              <div className={styles.parkPreview}>
                <p className={styles.parkPreviewTitle}>{selectedPark.name}</p>
                <p className={styles.parkPreviewMeta}>
                  {selectedPark.openingHours} · Entrada: {selectedPark.entranceFee}
                </p>
              </div>
            )}

            <button type="submit" className={styles.submitBtn}>
              Confirmar agendamento
            </button>
          </form>

          <aside className={styles.infoPanel}>
            <h2 className={styles.infoPanelTitle}>Informações importantes</h2>
            {[
              {
                icon: "🕐",
                title: "Antecedência",
                text: "Agende com pelo menos 24h de antecedência.",
              },
              {
                icon: "👥",
                title: "Grupos",
                text: "Grupos acima de 10 pessoas entram em contato direto.",
              },
              {
                icon: "🎒",
                title: "O que levar",
                text: "Água, protetor solar, calçado fechado e documento com foto.",
              },
              {
                icon: "📋",
                title: "Regras gerais",
                text: "Proibido fogueira, som alto e descarte de lixo nas trilhas.",
              },
              {
                icon: "♿",
                title: "Acessibilidade",
                text: "Informe necessidades especiais no campo de observações.",
              },
            ].map((item) => (
              <div key={item.title} className={styles.infoPanelItem}>
                <span className={styles.infoPanelIcon}>{item.icon}</span>
                <div>
                  <p className={styles.infoPanelItemTitle}>{item.title}</p>
                  <p className={styles.infoPanelItemText}>{item.text}</p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </main>
    </div>
  );
}
