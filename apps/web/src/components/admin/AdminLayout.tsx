import { Calendar, Footprints, LayoutDashboard, Leaf, LogOut, type LucideIcon } from "lucide-react";
import { useCallback } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { tv } from "tailwind-variants";

import { useAuth } from "@/hooks/useAuth";

const sidebarItemVariants = tv({
  base: "flex size-11 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-xl transition hover:bg-white/10",
  variants: {
    isActive: {
      true: "bg-white/20 opacity-100 hover:opacity-100",
      false: "opacity-55 hover:opacity-90",
    },
  },
  defaultVariants: { isActive: false },
});

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/trilhas": "Gestão de Trilhas",
  "/admin/eventos": "Gestão de Eventos",
};

const NAV_ITEMS = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/trilhas", icon: Footprints, label: "Trilhas" },
  { to: "/admin/eventos", icon: Calendar, label: "Eventos" },
] satisfies { to: string; icon: LucideIcon; label: string }[];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const todayFormatted = today.charAt(0).toUpperCase() + today.slice(1);

  const handleLogout = useCallback(() => {
    logout();
    return navigate("/admin");
  }, [logout, navigate]);

  const pageTitle = PAGE_TITLES[pathname] ?? "Painel administrativo";

  return (
    <div className="relative flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col items-center gap-1.5 bg-green-700 py-4">
        <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-white/12">
          <Leaf className="size-5 text-white" aria-hidden />
        </div>

        <nav
          className="flex w-full flex-col items-center gap-1"
          aria-label="Navegação administrativa"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              title={item.label}
              aria-label={item.label}
              className={sidebarItemVariants}
            >
              <item.icon className="size-5 text-green-100" aria-hidden />
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="mt-auto flex size-11 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-xl opacity-45 transition hover:opacity-90"
          onClick={handleLogout}
          title="Sair"
          aria-label="Sair do painel"
        >
          <LogOut className="size-5" aria-hidden />
        </button>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto bg-green-50 p-7">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl text-green-800">{pageTitle}</h1>
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

        <Outlet />
      </main>
    </div>
  );
}
