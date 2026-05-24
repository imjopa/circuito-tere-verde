import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAdminMetrics } from "../hooks/useAdminMetrics";
import { trails as initialTrails, type Trail, type TrailStatus } from "../data/trails";
import { events as initialEvents, type ParkEvent, type ParkEventStatus } from "../data/events";
import StatusBadge from "../components/ui/StatusBadge";
import {
  actionDeleteBtn,
  actionEditBtn,
  adminModal,
  eventStatusPill,
  manageCard,
  metricCard,
  sidebarItem,
} from "../lib/variants/admin";
import { formInput, formSelect, formTextarea } from "../lib/variants/input";

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
  const modalStyles = adminModal();
  const dangerModalStyles = adminModal({ danger: true });

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
    <div className="relative flex min-h-screen">
      {/* ── Sidebar ── */}
      <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col items-center gap-1.5 bg-green-700 py-4">
        <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-white/12 text-2xl">
          🌿
        </div>

        <nav
          className="flex w-full flex-col items-center gap-1"
          aria-label="Navegação administrativa"
        >
          {[
            { view: VIEWS.dashboard, icon: "📊", label: "Dashboard" },
            { view: VIEWS.trails, icon: "🥾", label: "Trilhas" },
            { view: VIEWS.events, icon: "📅", label: "Eventos" },
          ].map((item) => (
            <button
              key={item.view}
              className={sidebarItem({ active: activeView === item.view })}
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
          className="mt-auto flex size-11 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-xl opacity-45 transition hover:opacity-90"
          onClick={handleLogout}
          title="Sair"
          aria-label="Sair do painel"
        >
          🚪
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto bg-green-50 p-7">
        {/* Topbar */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl text-green-800">
              {activeView === VIEWS.dashboard && "Dashboard"}
              {activeView === VIEWS.trails && "Gestão de Trilhas"}
              {activeView === VIEWS.events && "Gestão de Eventos"}
            </h1>
            <p className="mt-0.5 text-[0.8125rem] text-gray-500">{todayFormatted}</p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-[0.8125rem] font-semibold text-white"
              aria-hidden="true"
            >
              AD
            </div>
            <span className="text-sm text-gray-700">Administrador</span>
          </div>
        </header>

        {/* ══════════════════════════════
            VIEW: DASHBOARD
        ══════════════════════════════ */}
        {activeView === VIEWS.dashboard && (
          <>
            <section
              aria-label="Resumo de métricas"
              className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4"
            >
              {(
                [
                  {
                    alert: false,
                    label: "Visitantes agendados (mês)",
                    value: metrics.scheduledVisitors,
                    delta: `via ${metrics.eventsThisMonth} evento${metrics.eventsThisMonth !== 1 ? "s" : ""}`,
                  },
                  {
                    alert: false,
                    label: "Trilhas abertas",
                    value: trailsData.filter((t) => t.status === "open" || t.status === "full")
                      .length,
                    delta: `de ${trailsData.length} cadastradas`,
                  },
                  {
                    alert: false,
                    label: "Eventos este mês",
                    value: metrics.eventsThisMonth,
                    delta: metrics.eventsThisMonth > 0 ? "Ativos no calendário" : "Nenhum agendado",
                  },
                  {
                    alert: metrics.activeAlerts > 0,
                    label: "Alertas ativos",
                    value: metrics.activeAlerts,
                    delta: metrics.activeAlerts === 0 ? "Tudo normal" : "Requer atenção",
                  },
                ] as const
              ).map((metric) => {
                const card = metricCard({ alert: metric.alert });
                return (
                  <div key={metric.label} className={card.root()}>
                    <p className={card.label()}>{metric.label}</p>
                    <p className={card.value()}>{metric.value}</p>
                    <span className={card.delta()}>{metric.delta}</span>
                  </div>
                );
              })}
            </section>

            <section
              className="grid grid-cols-2 items-start gap-4 max-[900px]:grid-cols-1"
              aria-label="Detalhes operacionais"
            >
              <div className="rounded-lg border border-gray-100 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[0.9375rem] font-medium text-green-800">
                    Status das trilhas
                  </h2>
                  <button
                    className="cursor-pointer border-none bg-transparent p-0 text-[0.8125rem] font-medium text-green-600 transition hover:text-green-800"
                    onClick={() => setActiveView(VIEWS.trails)}
                  >
                    Gerenciar →
                  </button>
                </div>
                <ul className="flex list-none flex-col">
                  {trailsData.slice(0, 5).map((trail) => (
                    <li
                      key={trail.id}
                      className="flex items-center gap-2.5 border-b border-gray-100 py-2 last:border-b-0"
                    >
                      <StatusBadge status={trail.status} />
                      <span className="min-w-0 flex-1 truncate text-[0.8125rem] text-gray-700">
                        {trail.name}
                      </span>
                      <span className="text-[0.6875rem] whitespace-nowrap text-gray-500">
                        {trail.parkName.split(" ")[0]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-lg border border-gray-100 bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-[0.9375rem] font-medium text-green-800">
                      Próximos eventos
                    </h2>
                    <button
                      className="cursor-pointer border-none bg-transparent p-0 text-[0.8125rem] font-medium text-green-600 transition hover:text-green-800"
                      onClick={() => setActiveView(VIEWS.events)}
                    >
                      Gerenciar →
                    </button>
                  </div>
                  <ul className="flex list-none flex-col">
                    {upcomingEvents.map((ev) => {
                      const evDate = new Date(ev.date + "T00:00:00");
                      const day = evDate.getDate().toString().padStart(2, "0");
                      const month = evDate
                        .toLocaleDateString("pt-BR", { month: "short" })
                        .replace(".", "")
                        .toUpperCase();
                      return (
                        <li
                          key={ev.id}
                          className="flex items-center gap-3 border-b border-gray-100 py-2 last:border-b-0"
                        >
                          <div className="min-w-10 shrink-0 rounded-md bg-green-700 px-2.5 py-1.5 text-center text-white">
                            <span className="block text-base leading-tight font-semibold">
                              {day}
                            </span>
                            <span className="text-[0.5625rem] tracking-wide uppercase opacity-80">
                              {month}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[0.8125rem] font-medium text-gray-800">
                              {ev.title}
                            </p>
                            <p className="mt-px text-[0.6875rem] text-gray-500">
                              {ev.park} · {ev.spotsLeft} vagas
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="flex flex-col items-center gap-2.5 rounded-lg border border-gray-100 bg-white p-5">
                  <p className="text-[0.6875rem] font-medium tracking-wider text-gray-500 uppercase">
                    Projeto acadêmico
                  </p>
                  <img
                    src="/unifeso-logo.png"
                    alt="Logotipo da UNIFESO"
                    className="w-full max-w-40 object-contain opacity-90"
                  />
                  <p className="text-center text-[0.6875rem] text-gray-500">
                    Desenvolvimento de MVP Front-End · 2025
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ══════════════════════════════
            VIEW: GESTÃO DE TRILHAS
        ══════════════════════════════ */}
        {activeView === VIEWS.trails && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{trailsData.length} trilhas cadastradas</p>
            </div>
            <div className="flex flex-col gap-3">
              {trailsData.map((trail) => {
                const card = manageCard();
                return (
                  <div key={trail.id} className={card.root()}>
                    <div className={card.left()}>
                      <StatusBadge status={trail.status} />
                      <div className={card.info()}>
                        <p className={card.name()}>{trail.name}</p>
                        <p className={card.meta()}>
                          {trail.parkName} · {trail.difficulty} · {trail.distance} km
                        </p>
                        <p className={card.conditions()}>{trail.conditions}</p>
                      </div>
                    </div>
                    <div className={card.actions()}>
                      <button
                        className={actionEditBtn()}
                        onClick={() => openEditTrail(trail)}
                        aria-label={`Editar trilha ${trail.name}`}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className={actionDeleteBtn()}
                        onClick={() => confirmDeleteTrail(trail.id)}
                        aria-label={`Excluir trilha ${trail.name}`}
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

        {/* ══════════════════════════════
            VIEW: GESTÃO DE EVENTOS
        ══════════════════════════════ */}
        {activeView === VIEWS.events && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{eventsData.length} eventos cadastrados</p>
            </div>
            <div className="flex flex-col gap-3">
              {eventsData.map((ev) => {
                const evDate = new Date(ev.date + "T00:00:00");
                const dateStr = evDate.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                const card = manageCard({ cancelled: ev.status === "cancelled" });
                return (
                  <div key={ev.id} className={card.root()}>
                    <div className={card.left()}>
                      <div className={eventStatusPill({ status: ev.status })}>
                        {EVENT_STATUS_OPTIONS.find((o) => o.value === ev.status)?.label ??
                          ev.status}
                      </div>
                      <div className={card.info()}>
                        <p className={card.name()}>{ev.title}</p>
                        <p className={card.meta()}>
                          {ev.park} · {dateStr} · {ev.time}
                        </p>
                        <p className={card.conditions()}>
                          {ev.spotsLeft} vagas restantes de {ev.spots} · {ev.price}
                        </p>
                      </div>
                    </div>
                    <div className={card.actions()}>
                      <button
                        className={actionEditBtn()}
                        onClick={() => openEditEvent(ev)}
                        aria-label={`Editar evento ${ev.title}`}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className={actionDeleteBtn()}
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
          className={modalStyles.overlay()}
          role="dialog"
          aria-modal="true"
          aria-label="Editar trilha"
        >
          <div className={modalStyles.panel()}>
            <div className={modalStyles.header()}>
              <h2 className={modalStyles.title()}>Editar trilha</h2>
              <button
                className={modalStyles.close()}
                onClick={() => setEditingTrail(null)}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <p className={modalStyles.subject()}>{editingTrail.name}</p>
            <p className={modalStyles.meta()}>
              {editingTrail.parkName} · {editingTrail.difficulty}
            </p>

            <div className={modalStyles.field()}>
              <label htmlFor="trailStatus" className={modalStyles.label()}>
                Status da trilha
              </label>
              <select
                id="trailStatus"
                value={trailStatusDraft ?? ""}
                onChange={(e) => setTrailStatusDraft(e.target.value as TrailStatus)}
                className={formSelect()}
              >
                {TRAIL_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className={modalStyles.preview()}>
                <span className={modalStyles.previewLabel()}>Pré-visualização:</span>
                <StatusBadge status={trailStatusDraft ?? DEFAULT_TRAIL_STATUS} />
              </div>
            </div>

            <div className={modalStyles.field()}>
              <label htmlFor="trailCond" className={modalStyles.label()}>
                Condições atuais
              </label>
              <textarea
                id="trailCond"
                value={trailCondDraft}
                onChange={(e) => setTrailCondDraft(e.target.value)}
                rows={3}
                className={formTextarea()}
                placeholder="Descreva as condições atuais da trilha..."
              />
            </div>

            <div className={modalStyles.actions()}>
              <button className={modalStyles.cancelBtn()} onClick={() => setEditingTrail(null)}>
                Cancelar
              </button>
              <button className={modalStyles.saveBtn()} onClick={saveTrail}>
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
          className={modalStyles.overlay()}
          role="dialog"
          aria-modal="true"
          aria-label="Editar evento"
        >
          <div className={modalStyles.panel()}>
            <div className={modalStyles.header()}>
              <h2 className={modalStyles.title()}>Editar evento</h2>
              <button
                className={modalStyles.close()}
                onClick={() => setEditingEvent(null)}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <p className={modalStyles.subject()}>{editingEvent.title}</p>
            <p className={modalStyles.meta()}>
              {editingEvent.park} · {editingEvent.date} · {editingEvent.time}
            </p>

            <div className={modalStyles.field()}>
              <label htmlFor="eventStatus" className={modalStyles.label()}>
                Status do evento
              </label>
              <select
                id="eventStatus"
                value={eventStatusDraft ?? ""}
                onChange={(e) => setEventStatusDraft(e.target.value as ParkEventStatus)}
                className={formSelect()}
              >
                {EVENT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={modalStyles.field()}>
              <label htmlFor="eventSpots" className={modalStyles.label()}>
                Vagas restantes
              </label>
              <input
                id="eventSpots"
                type="number"
                min={0}
                max={editingEvent.spots}
                value={eventSpotsDraft}
                onChange={(e) => setEventSpotsDraft(e.target.value)}
                className={formInput()}
              />
              <p className={modalStyles.hint()}>
                Capacidade total do evento: {editingEvent.spots} vagas
              </p>
            </div>

            <div className={modalStyles.actions()}>
              <button className={modalStyles.cancelBtn()} onClick={() => setEditingEvent(null)}>
                Cancelar
              </button>
              <button className={modalStyles.saveBtn()} onClick={saveEvent}>
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
          className={dangerModalStyles.overlay()}
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar exclusão"
        >
          <div className={dangerModalStyles.panel()}>
            <div className={dangerModalStyles.header()}>
              <h2 className={dangerModalStyles.title()}>Confirmar exclusão</h2>
              <button
                className={dangerModalStyles.close()}
                onClick={() => setDeleteTarget(null)}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>
            <p className={dangerModalStyles.deleteWarning()}>
              ⚠️ Esta ação é <strong>irreversível</strong>. O registro será removido permanentemente
              da listagem.
            </p>
            <p className={dangerModalStyles.deleteNote()}>
              Em produção, esta ação exigiria confirmação dupla e registro em log de auditoria.
            </p>
            <div className={dangerModalStyles.actions()}>
              <button
                className={dangerModalStyles.cancelBtn()}
                onClick={() => setDeleteTarget(null)}
              >
                Cancelar
              </button>
              <button className={dangerModalStyles.deleteConfirmBtn()} onClick={executeDelete}>
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
