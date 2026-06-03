import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function navClass({ isActive }) {
  return isActive ? 'navbar-link active' : 'navbar-link';
}

export default function Navbar({ onLogout }) {
  const { user, logout, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user
    ? `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase()
    : '';

  const roleLabel = user?.role === 'admin' ? 'Admin' : 'Utilisateur';

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await logout();
    onLogout?.();
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="navbar-logo-icon" aria-hidden>⚡</span>
          <span className="navbar-logo-text">EventMaster</span>
        </NavLink>

        <button
          type="button"
          className={`navbar-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-menu ${menuOpen ? 'open' : ''}`} aria-label="Navigation principale">
          <NavLink to="/" end className={navClass} onClick={closeMenu}>
            Événements
          </NavLink>
          {isAdmin && (
            <NavLink to="/dashboard" className={navClass} onClick={closeMenu}>
              Dashboard
            </NavLink>
          )}
          {!user && (
            <>
              <NavLink to="/register" className={navClass} onClick={closeMenu}>
                Inscription
              </NavLink>
              <NavLink to="/login" className={navClass} onClick={closeMenu}>
                Connexion
              </NavLink>
            </>
          )}
        </nav>

        {user && (
          <div className="navbar-user">
            <div className="user-profile-chip">
              <div className="navbar-avatar" title={`${user.prenom} ${user.nom}`}>
                {initials}
              </div>
              <div className="navbar-user-info">
                <span className="navbar-username">
                  {user.prenom} {user.nom}
                </span>
                <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-utilisateur'}`}>
                  {roleLabel}
                </span>
              </div>
            </div>
            <button type="button" className="navbar-logout-btn" onClick={handleLogout}>
              <span className="logout-label-full">Déconnexion</span>
              <span className="logout-label-short" aria-hidden>↪</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
