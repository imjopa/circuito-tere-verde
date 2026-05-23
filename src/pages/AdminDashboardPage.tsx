import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAdminMetrics } from "../hooks/useAdminMetrics";
import { trails as initialTrails, type Trail, type TrailStatus } from "../data/trails";
import { events as initialEvents, type ParkEvent, type ParkEventStatus } from "../data/events";
import StatusBadge from "../components/ui/StatusBadge";
import styles from "./AdminDashboardPage.module.css";

const DEFAULT_TRAIL_STATUS: TrailStatus = "open";
const DEFAULT_EVENT_STATUS: ParkEventStatus = "open";

// ── Opções de status editáveis pelo admin ──
const TRAIL_STATUS_OPTIONS = [
  { value: "open", label: "Aberta" },
  { value: "closed", label: "Fechada" },
  { value: "maintenance", label: "Manutenção" },
  { value: "climate_risk", label: "Risco Climático" },
  { value: "full", label: "Lotada" },
];

const EVENT_STATUS_OPTIONS = [
  { value: "open", label: "Vagas disponíveis" },
  { value: "few_spots", label: "Últimas vagas" },
  { value: "full", label: "Esgotado" },
  { value: "cancelled", label: "Cancelado" },
];

// ── Views disponíveis na sidebar ──
const VIEWS = {
  dashboard: "dashboard",
  trails: "trails",
  events: "events",
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const metrics = useAdminMetrics();

  // Estado da view ativa na sidebar
  const [activeView, setActiveView] = useState(VIEWS.dashboard);

  // Estado local de trilhas e eventos (substituiria chamada de API em produção)
  const [trailsData, setTrailsData] = useState(initialTrails);
  const [eventsData, setEventsData] = useState(initialEvents);

  // Modal de edição de trilha
  const [editingTrail, setEditingTrail] = useState<Trail | null>(null);
  const [trailStatusDraft, setTrailStatusDraft] = useState<TrailStatus | null>(null);
  const [trailCondDraft, setTrailCondDraft] = useState("");

  // Modal de edição de evento
  const [editingEvent, setEditingEvent] = useState<ParkEvent | null>(null);
  const [eventStatusDraft, setEventStatusDraft] = useState<ParkEventStatus | null>(null);
  const [eventSpotsDraft, setEventSpotsDraft] = useState("");

  // Confirmação de exclusão
  const [deleteTarget, setDeleteTarget] = useState<{ type: "trail" | "event"; id: string } | null>(
    null,
  );

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const todayFormatted = today.charAt(0).toUpperCase() + today.slice(1);

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  // ── Próximos 3 eventos ──
  const upcomingEvents = eventsData
    .filter((ev) => new Date(ev.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // ── Handlers trilhas ──
  const openEditTrail = (trail: Trail) => {
    setEditingTrail(trail);
    setTrailStatusDraft(trail.status);
    setTrailCondDraft(trail.conditions);
  };

  const saveTrail = () => {
    if (!editingTrail) return;

    setTrailsData((prev) =>
      prev.map((t) =>
        t.id === editingTrail.id
          ? { ...t, status: trailStatusDraft ?? DEFAULT_TRAIL_STATUS, conditions: trailCondDraft }
          : t,
      ),
    );
    setEditingTrail(null);
  };

  const confirmDeleteTrail = (id: string) => {
    setDeleteTarget({ type: "trail", id });
  };

  // ── Handlers eventos ──
  const openEditEvent = (ev: ParkEvent) => {
    setEditingEvent(ev);
    setEventStatusDraft(ev.status);
    setEventSpotsDraft(String(ev.spotsLeft));
  };

  const saveEvent = () => {
    if (!editingEvent) return;

    setEventsData((prev) =>
      prev.map((ev) =>
        ev.id === editingEvent.id
          ? {
              ...ev,
              status: eventStatusDraft ?? DEFAULT_EVENT_STATUS,
              spotsLeft: Number(eventSpotsDraft),
            }
          : ev,
      ),
    );
    setEditingEvent(null);
  };

  const confirmDeleteEvent = (id: string) => {
    setDeleteTarget({ type: "event", id });
  };

  // ── Confirmar exclusão ──
  const executeDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "trail") {
      setTrailsData((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    } else {
      setEventsData((prev) => prev.filter((ev) => ev.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  return (
    <div className={styles.layout}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>🌿</div>

        <nav className={styles.sidebarNav} aria-label="Navegação administrativa">
          {[
            { view: VIEWS.dashboard, icon: "📊", label: "Dashboard" },
            { view: VIEWS.trails, icon: "🥾", label: "Trilhas" },
            { view: VIEWS.events, icon: "📅", label: "Eventos" },
          ].map((item) => (
            <button
              key={item.view}
              className={`${styles.sidebarItem} ${activeView === item.view ? styles.sidebarActive : ""}`}
              onClick={() => setActiveView(item.view)}
              title={item.label}
              aria-label={item.label}
              aria-pressed={activeView === item.view}
            >
              {item.icon}
            </button>
          ))}
        </nav>

        <button
          className={styles.sidebarLogout}
          onClick={handleLogout}
          title="Sair"
          aria-label="Sair do painel"
        >
          🚪
        </button>
      </aside>

      {/* ── Main ── */}
      <main className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>
              {activeView === VIEWS.dashboard && "Dashboard"}
              {activeView === VIEWS.trails && "Gestão de Trilhas"}
              {activeView === VIEWS.events && "Gestão de Eventos"}
            </h1>
            <p className={styles.pageDate}>{todayFormatted}</p>
          </div>
          <div className={styles.adminUser}>
            <div className={styles.avatar} aria-hidden="true">
              AD
            </div>
            <span className={styles.adminName}>Administrador</span>
          </div>
        </header>

        {/* ══════════════════════════════
            VIEW: DASHBOARD
        ══════════════════════════════ */}
        {activeView === VIEWS.dashboard && (
          <>
            <section aria-label="Resumo de métricas" className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <p className={styles.metricLabel}>Visitantes agendados (mês)</p>
                <p className={styles.metricValue}>{metrics.scheduledVisitors}</p>
                <span className={styles.metricDelta}>
                  via {metrics.eventsThisMonth} evento{metrics.eventsThisMonth !== 1 ? "s" : ""}
                </span>
              </div>
              <div className={styles.metricCard}>
                <p className={styles.metricLabel}>Trilhas abertas</p>
                <p className={styles.metricValue}>
                  {trailsData.filter((t) => t.status === "open" || t.status === "full").length}
                </p>
                <span className={styles.metricDelta}>de {trailsData.length} cadastradas</span>
              </div>
              <div className={styles.metricCard}>
                <p className={styles.metricLabel}>Eventos este mês</p>
                <p className={styles.metricValue}>{metrics.eventsThisMonth}</p>
                <span className={styles.metricDelta}>
                  {metrics.eventsThisMonth > 0 ? "Ativos no calendário" : "Nenhum agendado"}
                </span>
              </div>
              <div
                className={`${styles.metricCard} ${metrics.activeAlerts > 0 ? styles.metricCardAlert : ""}`}
              >
                <p className={styles.metricLabel}>Alertas ativos</p>
                <p
                  className={`${styles.metricValue} ${metrics.activeAlerts > 0 ? styles.metricValueAlert : ""}`}
                >
                  {metrics.activeAlerts}
                </p>
                <span
                  className={`${styles.metricDelta} ${metrics.activeAlerts > 0 ? styles.deltaAlert : ""}`}
                >
                  {metrics.activeAlerts === 0 ? "Tudo normal" : "Requer atenção"}
                </span>
              </div>
            </section>

            <section className={styles.contentGrid} aria-label="Detalhes operacionais">
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Status das trilhas</h2>
                  <button className={styles.viewAllBtn} onClick={() => setActiveView(VIEWS.trails)}>
                    Gerenciar →
                  </button>
                </div>
                <ul className={styles.trailList}>
                  {trailsData.slice(0, 5).map((trail) => (
                    <li key={trail.id} className={styles.trailRow}>
                      <StatusBadge status={trail.status} />
                      <span className={styles.trailName}>{trail.name}</span>
                      <span className={styles.trailPark}>{trail.parkName.split(" ")[0]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.rightCol}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Próximos eventos</h2>
                    <button
                      className={styles.viewAllBtn}
                      onClick={() => setActiveView(VIEWS.events)}
                    >
                      Gerenciar →
                    </button>
                  </div>
                  <ul className={styles.eventList}>
                    {upcomingEvents.map((ev) => {
                      const evDate = new Date(ev.date + "T00:00:00");
                      const day = evDate.getDate().toString().padStart(2, "0");
                      const month = evDate
                        .toLocaleDateString("pt-BR", { month: "short" })
                        .replace(".", "")
                        .toUpperCase();
                      return (
                        <li key={ev.id} className={styles.eventRow}>
                          <div className={styles.eventDate}>
                            <span className={styles.eventDay}>{day}</span>
                            <span className={styles.eventMonth}>{month}</span>
                          </div>
                          <div className={styles.eventInfo}>
                            <p className={styles.eventTitle}>{ev.title}</p>
                            <p className={styles.eventMeta}>
                              {ev.park} · {ev.spotsLeft} vagas
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className={styles.unifesoCard}>
                  <p className={styles.unifesoLabel}>Projeto acadêmico</p>
                  <img
                    src="/unifeso-logo.png"
                    alt="Logotipo da UNIFESO"
                    className={styles.unifesoLogo}
                  />
                  <p className={styles.unifesoCaption}>Desenvolvimento de MVP Front-End · 2025</p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ══════════════════════════════
            VIEW: GESTÃO DE TRILHAS
        ══════════════════════════════ */}
        {activeView === VIEWS.trails && (
          <section className={styles.manageSection}>
            <div className={styles.manageSectionHeader}>
              <p className={styles.manageSectionCount}>{trailsData.length} trilhas cadastradas</p>
            </div>
            <div className={styles.manageList}>
              {trailsData.map((trail) => (
                <div key={trail.id} className={styles.manageCard}>
                  <div className={styles.manageCardLeft}>
                    <StatusBadge status={trail.status} />
                    <div className={styles.manageCardInfo}>
                      <p className={styles.manageCardName}>{trail.name}</p>
                      <p className={styles.manageCardMeta}>
                        {trail.parkName} · {trail.difficulty} · {trail.distance} km
                      </p>
                      <p className={styles.manageCardConditions}>{trail.conditions}</p>
                    </div>
                  </div>
                  <div className={styles.manageCardActions}>
                    <button
                      className={styles.actionEditBtn}
                      onClick={() => openEditTrail(trail)}
                      aria-label={`Editar trilha ${trail.name}`}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className={styles.actionDeleteBtn}
                      onClick={() => confirmDeleteTrail(trail.id)}
                      aria-label={`Excluir trilha ${trail.name}`}
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══════════════════════════════
            VIEW: GESTÃO DE EVENTOS
        ══════════════════════════════ */}
        {activeView === VIEWS.events && (
          <section className={styles.manageSection}>
            <div className={styles.manageSectionHeader}>
              <p className={styles.manageSectionCount}>{eventsData.length} eventos cadastrados</p>
            </div>
            <div className={styles.manageList}>
              {eventsData.map((ev) => {
                const evDate = new Date(ev.date + "T00:00:00");
                const dateStr = evDate.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                const isCancelled = ev.status === "cancelled";
                return (
                  <div
                    key={ev.id}
                    className={`${styles.manageCard} ${isCancelled ? styles.manageCardCancelled : ""}`}
                  >
                    <div className={styles.manageCardLeft}>
                      <div className={styles.eventStatusPill} data-status={ev.status}>
                        {EVENT_STATUS_OPTIONS.find((o) => o.value === ev.status)?.label ??
                          ev.status}
                      </div>
                      <div className={styles.manageCardInfo}>
                        <p className={styles.manageCardName}>{ev.title}</p>
                        <p className={styles.manageCardMeta}>
                          {ev.park} · {dateStr} · {ev.time}
                        </p>
                        <p className={styles.manageCardConditions}>
                          {ev.spotsLeft} vagas restantes de {ev.spots} · {ev.price}
                        </p>
                      </div>
                    </div>
                    <div className={styles.manageCardActions}>
                      <button
                        className={styles.actionEditBtn}
                        onClick={() => openEditEvent(ev)}
                        aria-label={`Editar evento ${ev.title}`}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className={styles.actionDeleteBtn}
                        onClick={() => confirmDeleteEvent(ev.id)}
                        aria-label={`Excluir evento ${ev.title}`}
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* ══════════════════════════════
          MODAL — Editar Trilha
      ══════════════════════════════ */}
      {editingTrail && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Editar trilha"
        >
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Editar trilha</h2>
              <button
                className={styles.modalClose}
                onClick={() => setEditingTrail(null)}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <p className={styles.modalSubject}>{editingTrail.name}</p>
            <p className={styles.modalMeta}>
              {editingTrail.parkName} · {editingTrail.difficulty}
            </p>

            <div className={styles.modalField}>
              <label htmlFor="trailStatus" className={styles.modalLabel}>
                Status da trilha
              </label>
              <select
                id="trailStatus"
                value={trailStatusDraft ?? ""}
                onChange={(e) => setTrailStatusDraft(e.target.value as TrailStatus)}
                className={styles.modalSelect}
              >
                {TRAIL_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className={styles.modalPreview}>
                <span className={styles.modalPreviewLabel}>Pré-visualização:</span>
                <StatusBadge status={trailStatusDraft ?? DEFAULT_TRAIL_STATUS} />
              </div>
            </div>

            <div className={styles.modalField}>
              <label htmlFor="trailCond" className={styles.modalLabel}>
                Condições atuais
              </label>
              <textarea
                id="trailCond"
                value={trailCondDraft}
                onChange={(e) => setTrailCondDraft(e.target.value)}
                rows={3}
                className={styles.modalTextarea}
                placeholder="Descreva as condições atuais da trilha..."
              />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.modalCancelBtn} onClick={() => setEditingTrail(null)}>
                Cancelar
              </button>
              <button className={styles.modalSaveBtn} onClick={saveTrail}>
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          MODAL — Editar Evento
      ══════════════════════════════ */}
      {editingEvent && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Editar evento"
        >
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Editar evento</h2>
              <button
                className={styles.modalClose}
                onClick={() => setEditingEvent(null)}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <p className={styles.modalSubject}>{editingEvent.title}</p>
            <p className={styles.modalMeta}>
              {editingEvent.park} · {editingEvent.date} · {editingEvent.time}
            </p>

            <div className={styles.modalField}>
              <label htmlFor="eventStatus" className={styles.modalLabel}>
                Status do evento
              </label>
              <select
                id="eventStatus"
                value={eventStatusDraft ?? ""}
                onChange={(e) => setEventStatusDraft(e.target.value as ParkEventStatus)}
                className={styles.modalSelect}
              >
                {EVENT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.modalField}>
              <label htmlFor="eventSpots" className={styles.modalLabel}>
                Vagas restantes
              </label>
              <input
                id="eventSpots"
                type="number"
                min={0}
                max={editingEvent.spots}
                value={eventSpotsDraft}
                onChange={(e) => setEventSpotsDraft(e.target.value)}
                className={styles.modalInput}
              />
              <p className={styles.modalHint}>
                Capacidade total do evento: {editingEvent.spots} vagas
              </p>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.modalCancelBtn} onClick={() => setEditingEvent(null)}>
                Cancelar
              </button>
              <button className={styles.modalSaveBtn} onClick={saveEvent}>
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          MODAL — Confirmar exclusão
      ══════════════════════════════ */}
      {deleteTarget && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar exclusão"
        >
          <div className={`${styles.modal} ${styles.modalDanger}`}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Confirmar exclusão</h2>
              <button
                className={styles.modalClose}
                onClick={() => setDeleteTarget(null)}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>
            <p className={styles.deleteWarning}>
              ⚠️ Esta ação é <strong>irreversível</strong>. O registro será removido permanentemente
              da listagem.
            </p>
            <p className={styles.deleteNote}>
              Em produção, esta ação exigiria confirmação dupla e registro em log de auditoria.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancelBtn} onClick={() => setDeleteTarget(null)}>
                Cancelar
              </button>
              <button className={styles.modalDeleteConfirmBtn} onClick={executeDelete}>
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
