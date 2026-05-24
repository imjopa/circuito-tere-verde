import { useState } from "react";
import { Leaf, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { tv } from "tailwind-variants";

const NAV_LINKS = [
  { to: "/", label: "Parques" },
  { to: "/trilhas", label: "Trilhas" },
  { to: "/cachoeiras", label: "Cachoeiras" },
  { to: "/eventos", label: "Eventos" },
  { to: "/sobre", label: "Sobre" },
];

const variants = tv({
  base: "pb-0.5 text-sm text-white/75 transition hover:text-green-300",
  variants: {
    active: {
      true: "border-b-2 border-green-400 text-green-400",
      false: "",
    },
  },
});

const mobileNavLinkVariants = tv({
  base: "border-b border-white/10 py-3 text-sm text-white/80 transition hover:text-green-400",
  variants: {
    active: {
      true: "text-green-400",
      false: "",
    },
  },
});

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (to: string) => {
    return to === "/" ? pathname === "/" : pathname.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-100 bg-green-700 shadow-md">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6"
        aria-label="Navegação principal"
      >
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="Circuito Terê Verde — página inicial"
        >
          <Leaf className="size-5 text-white" aria-hidden />
          <span className="font-display text-base font-semibold whitespace-nowrap text-white">
            Circuito Terê Verde
          </span>
        </Link>

        <ul className="ml-auto hidden list-none gap-5 md:flex" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className={variants({ active: isActive(link.to) })}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/admin"
          className="hidden shrink-0 rounded-full bg-green-400 px-4 py-1.5 text-sm font-medium whitespace-nowrap text-green-900 transition hover:bg-green-300 md:inline-block"
        >
          Área Admin
        </Link>

        <button
          className="ml-auto flex cursor-pointer items-center justify-center border-none bg-transparent text-xl text-white md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X className="size-5" aria-hidden />
          ) : (
            <Menu className="size-5" aria-hidden />
          )}
        </button>
      </nav>

      {menuOpen && (
        <div
          className="flex flex-col gap-0 border-t border-white/10 bg-green-800 px-6 pt-2 pb-4 md:hidden"
          role="navigation"
          aria-label="Menu mobile"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={mobileNavLinkVariants({ active: isActive(link.to) })}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/admin"
            className="mt-3.5 inline-block rounded-full bg-green-400 px-5 py-2 text-center text-sm font-medium text-green-900 transition hover:bg-green-300"
            onClick={() => setMenuOpen(false)}
          >
            Área Admin
          </Link>
        </div>
      )}
    </header>
  );
}
