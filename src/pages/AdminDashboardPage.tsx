import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import StatusBadge from "@/components/ui/StatusBadge";
import { TextArea } from "@/components/ui/TextArea";
import { events as initialEvents, type ParkEvent, type ParkEventStatus } from "@/data/events";
import { trails as initialTrails, type Trail, type TrailStatus } from "@/data/trails";
import { useAdminMetrics } from "@/hooks/useAdminMetrics";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertTriangle,
  Calendar,
  Footprints,
  LayoutDashboard,
  Leaf,
  LogOut,
  Pencil,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tv } from "tailwind-variants";

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

const sidebarItemVariants = tv({
  base: "flex size-11 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-xl transition hover:bg-white/10",
  variants: {
    active: {
      true: "bg-white/20 opacity-100 hover:opacity-100",
      false: "opacity-55 hover:opacity-90",
    },
  },
  defaultVariants: { active: false },
});

const eventStatusPillVariants = tv({
  base: "shrink-0 self-start rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
  variants: {
    status: {
      open: "bg-green-100 text-green-900",
      few_spots: "bg-orange-100 text-orange-900",
      full: "bg-red-100 text-red-900",
      cancelled: "bg-gray-100 text-gray-500",
    },
  },
});

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
    <div className="relative flex min-h-screen">
      {/* ── Sidebar ── */}
      <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col items-center gap-1.5 bg-green-700 py-4">
        <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-white/12">
          <Leaf className="size-5 text-white" aria-hidden />
        </div>

        <nav
          className="flex w-full flex-col items-center gap-1"
          aria-label="Navegação administrativa"
        >
          {(
            [
              { view: VIEWS.dashboard, icon: LayoutDashboard, label: "Dashboard" },
              { view: VIEWS.trails, icon: Footprints, label: "Trilhas" },
              { view: VIEWS.events, icon: Calendar, label: "Eventos" },
            ] satisfies { view: string; icon: LucideIcon; label: string }[]
          ).map((item) => (
            <button
              key={item.view}
              className={sidebarItemVariants({ active: activeView === item.view })}
              onClick={() => setActiveView(item.view)}
              title={item.label}
              aria-label={item.label}
              aria-pressed={activeView === item.view}
            >
              <item.icon className="size-5" aria-hidden />
            </button>
          ))}
        </nav>

        <button
          className="mt-auto flex size-11 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-xl opacity-45 transition hover:opacity-90"
          onClick={handleLogout}
          title="Sair"
          aria-label="Sair do painel"
        >
          <LogOut className="size-5" aria-hidden />
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
            <p className="mt-0.5 text-sm text-gray-500">{todayFormatted}</p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white"
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
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
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
              ).map((metric) => (
                <div
                  key={metric.label}
                  className={`rounded-lg border px-5 py-4 ${
                    metric.alert ? "border-red-300 bg-red-50" : "border-gray-100 bg-white"
                  }`}
                >
                  <p className="mb-1.5 text-xs leading-snug text-gray-500">{metric.label}</p>
                  <p
                    className={`font-display text-3xl leading-none font-semibold ${
                      metric.alert ? "text-red-700" : "text-green-800"
                    }`}
                  >
                    {metric.value}
                  </p>
                  <span
                    className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-xs ${
                      metric.alert ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {metric.delta}
                  </span>
                </div>
              ))}
            </section>

            <section
              className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2"
              aria-label="Detalhes operacionais"
            >
              <div className="rounded-lg border border-gray-100 bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-medium text-green-800">Status das trilhas</h2>
                  <button
                    className="cursor-pointer border-none bg-transparent p-0 text-sm font-medium text-green-600 transition hover:text-green-800"
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
                      <span className="min-w-0 flex-1 truncate text-sm text-gray-700">
                        {trail.name}
                      </span>
                      <span className="text-xs whitespace-nowrap text-gray-500">
                        {trail.parkName.split(" ")[0]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-lg border border-gray-100 bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-medium text-green-800">Próximos eventos</h2>
                    <button
                      className="cursor-pointer border-none bg-transparent p-0 text-sm font-medium text-green-600 transition hover:text-green-800"
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
                            <span className="text-xs tracking-wide uppercase opacity-80">
                              {month}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-800">{ev.title}</p>
                            <p className="mt-px text-xs text-gray-500">
                              {ev.park} · {ev.spotsLeft} vagas
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="flex flex-col items-center gap-2.5 rounded-lg border border-gray-100 bg-white p-5">
                  <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Projeto acadêmico
                  </p>
                  <img
                    src="/unifeso-logo.png"
                    alt="Logotipo da UNIFESO"
                    className="w-full max-w-40 object-contain opacity-90"
                  />
                  <p className="text-center text-xs text-gray-500">
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
              {trailsData.map((trail) => (
                <div
                  key={trail.id}
                  className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 bg-white px-5 py-4 transition hover:shadow-sm"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3.5">
                    <StatusBadge status={trail.status} />
                    <div className="min-w-0 flex-1">
                      <p className="mb-0.5 truncate text-sm font-medium text-gray-900">
                        {trail.name}
                      </p>
                      <p className="mb-1 text-sm text-gray-500">
                        {trail.parkName} · {trail.difficulty} · {trail.distance} km
                      </p>
                      <p className="rounded-sm border-l-4 border-green-300 bg-gray-50 px-2 py-1 text-sm leading-normal text-gray-600">
                        {trail.conditions}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    <button
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-green-800 transition hover:bg-green-100"
                      onClick={() => openEditTrail(trail)}
                      aria-label={`Editar trilha ${trail.name}`}
                    >
                      <Pencil className="size-3.5" aria-hidden />
                      Editar
                    </button>
                    <button
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-red-700 transition hover:bg-red-100"
                      onClick={() => confirmDeleteTrail(trail.id)}
                      aria-label={`Excluir trilha ${trail.name}`}
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      Excluir
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
                return (
                  <div
                    key={ev.id}
                    className={`flex items-start justify-between gap-4 rounded-lg border border-gray-100 bg-white px-5 py-4 transition hover:shadow-sm${
                      ev.status === "cancelled" ? " opacity-55" : ""
                    }`}
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-3.5">
                      <div className={eventStatusPillVariants({ status: ev.status })}>
                        {EVENT_STATUS_OPTIONS.find((o) => o.value === ev.status)?.label ??
                          ev.status}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="mb-0.5 truncate text-sm font-medium text-gray-900">
                          {ev.title}
                        </p>
                        <p className="mb-1 text-sm text-gray-500">
                          {ev.park} · {dateStr} · {ev.time}
                        </p>
                        <p className="rounded-sm border-l-4 border-green-300 bg-gray-50 px-2 py-1 text-sm leading-normal text-gray-600">
                          {ev.spotsLeft} vagas restantes de {ev.spots} · {ev.price}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2">
                      <button
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-green-800 transition hover:bg-green-100"
                        onClick={() => openEditEvent(ev)}
                        aria-label={`Editar evento ${ev.title}`}
                      >
                        <Pencil className="size-3.5" aria-hidden />
                        Editar
                      </button>
                      <button
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3.5 py-1.5 text-sm font-medium whitespace-nowrap text-red-700 transition hover:bg-red-100"
                        onClick={() => confirmDeleteEvent(ev.id)}
                        aria-label={`Excluir evento ${ev.title}`}
                      >
                        <Trash2 className="size-3.5" aria-hidden />
                        Excluir
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Editar trilha"
        >
          <div className="flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-7 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-green-800">Editar trilha</h2>
              <button
                className="flex size-7 cursor-pointer items-center justify-center rounded-full border-none bg-gray-100 text-sm text-gray-500 transition hover:bg-gray-200"
                onClick={() => setEditingTrail(null)}
                aria-label="Fechar"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <p className="text-sm font-medium text-gray-900">{editingTrail.name}</p>
            <p className="-mt-1.5 text-sm text-gray-500">
              {editingTrail.parkName} · {editingTrail.difficulty}
            </p>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="trailStatus" className="text-sm font-medium text-gray-600">
                Status da trilha
              </label>
              <Select
                id="trailStatus"
                value={trailStatusDraft ?? ""}
                onChange={(e) => setTrailStatusDraft(e.target.value as TrailStatus)}
              >
                {TRAIL_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-gray-500">Pré-visualização:</span>
                <StatusBadge status={trailStatusDraft ?? DEFAULT_TRAIL_STATUS} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="trailCond" className="text-sm font-medium text-gray-600">
                Condições atuais
              </label>
              <TextArea
                id="trailCond"
                value={trailCondDraft}
                onChange={(e) => setTrailCondDraft(e.target.value)}
                rows={3}
                placeholder="Descreva as condições atuais da trilha..."
              />
            </div>

            <div className="mt-1 flex justify-end gap-3">
              <button
                className="cursor-pointer rounded-md border-none bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                onClick={() => setEditingTrail(null)}
              >
                Cancelar
              </button>
              <button
                className="cursor-pointer rounded-md border-none bg-green-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-800"
                onClick={saveTrail}
              >
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Editar evento"
        >
          <div className="flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-7 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-green-800">Editar evento</h2>
              <button
                className="flex size-7 cursor-pointer items-center justify-center rounded-full border-none bg-gray-100 text-sm text-gray-500 transition hover:bg-gray-200"
                onClick={() => setEditingEvent(null)}
                aria-label="Fechar"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <p className="text-sm font-medium text-gray-900">{editingEvent.title}</p>
            <p className="-mt-1.5 text-sm text-gray-500">
              {editingEvent.park} · {editingEvent.date} · {editingEvent.time}
            </p>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="eventStatus" className="text-sm font-medium text-gray-600">
                Status do evento
              </label>
              <Select
                id="eventStatus"
                value={eventStatusDraft ?? ""}
                onChange={(e) => setEventStatusDraft(e.target.value as ParkEventStatus)}
              >
                {EVENT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="eventSpots" className="text-sm font-medium text-gray-600">
                Vagas restantes
              </label>
              <Input
                id="eventSpots"
                type="number"
                min={0}
                max={editingEvent.spots}
                value={eventSpotsDraft}
                onChange={(e) => setEventSpotsDraft(e.target.value)}
              />
              <p className="mt-0.5 text-xs text-gray-500">
                Capacidade total do evento: {editingEvent.spots} vagas
              </p>
            </div>

            <div className="mt-1 flex justify-end gap-3">
              <button
                className="cursor-pointer rounded-md border-none bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                onClick={() => setEditingEvent(null)}
              >
                Cancelar
              </button>
              <button
                className="cursor-pointer rounded-md border-none bg-green-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-800"
                onClick={saveEvent}
              >
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar exclusão"
        >
          <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border-t-4 border-red-400 bg-white p-7 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-green-800">Confirmar exclusão</h2>
              <button
                className="flex size-7 cursor-pointer items-center justify-center rounded-full border-none bg-gray-100 text-sm text-gray-500 transition hover:bg-gray-200"
                onClick={() => setDeleteTarget(null)}
                aria-label="Fechar"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3.5 text-sm leading-relaxed text-gray-700">
              <span className="inline-flex items-start gap-1.5">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  Esta ação é <strong>irreversível</strong>. O registro será removido
                  permanentemente da listagem.
                </span>
              </span>
            </p>
            <p className="text-sm leading-normal text-gray-500 italic">
              Em produção, esta ação exigiria confirmação dupla e registro em log de auditoria.
            </p>
            <div className="mt-1 flex justify-end gap-3">
              <button
                className="cursor-pointer rounded-md border-none bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                onClick={() => setDeleteTarget(null)}
              >
                Cancelar
              </button>
              <button
                className="cursor-pointer rounded-md border-none bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                onClick={executeDelete}
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
