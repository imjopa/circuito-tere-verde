import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { to: '/',           label: 'Parques'    },
  { to: '/trilhas',    label: 'Trilhas'    },
  { to: '/cachoeiras', label: 'Cachoeiras' },
  { to: '/eventos',    label: 'Eventos'    },
  { to: '/sobre',      label: 'Sobre'      },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  function isActive(to) {
    return to === '/' ? pathname === '/' : pathname.startsWith(to)
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Navegação principal">
        <Link to="/" className={styles.brand} aria-label="Circuito Terê Verde — página inicial">
          <span className={styles.brandIcon} aria-hidden="true">🌿</span>
          <span className={styles.brandName}>Circuito Terê Verde</span>
        </Link>

        {/* Links desktop */}
        <ul className={styles.links} role="list">
          {NAV_LINKS.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={isActive(link.to) ? styles.active : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link to="/admin" className={styles.adminBtn}>
          Área Admin
        </Link>

        {/* Botão hambúrguer mobile */}
        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Menu mobile */}
      {menuOpen && (
        <div className={styles.mobileMenu} role="navigation" aria-label="Menu mobile">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`${styles.mobileLink} ${isActive(link.to) ? styles.mobileLinkActive : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/admin" className={styles.mobileAdminBtn} onClick={() => setMenuOpen(false)}>
            Área Admin
          </Link>
        </div>
      )}
    </header>
  )
}
