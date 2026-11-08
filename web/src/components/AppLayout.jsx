import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { House, Heart, History, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { initials } from '../lib/meta.js';
import { Logo } from './ui.jsx';

const NAV = [
  { to: '/', label: 'Beranda', icon: House, end: true },
  { to: '/favorit', label: 'Favorit', icon: Heart },
  { to: '/riwayat', label: 'Riwayat', icon: History },
  { to: '/profil', label: 'Profil', icon: User, mobileOnly: true },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="shell">
      <header className="topbar">
        <div className="container topbar__inner">
          <NavLink to="/" aria-label="SkillLearn beranda">
            <Logo />
          </NavLink>

          <nav className="nav" aria-label="Navigasi utama">
            {NAV.filter((n) => !n.mobileOnly).map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}>
                <Icon size={18} aria-hidden />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="usermenu" ref={menuRef}>
            <button
              type="button"
              className="usermenu__trigger"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="avatar">{initials(user?.name)}</span>
              <span className="usermenu__name">{user?.name?.split(' ')[0]}</span>
              <ChevronDown size={16} aria-hidden />
            </button>
            {open && (
              <div className="usermenu__panel" role="menu">
                <div className="usermenu__head">
                  <strong>{user?.name}</strong>
                  <span>{user?.email}</span>
                </div>
                <button type="button" role="menuitem" onClick={() => (setOpen(false), navigate('/profil'))}>
                  <User size={16} aria-hidden /> Profil saya
                </button>
                <button type="button" role="menuitem" className="danger" onClick={handleLogout}>
                  <LogOut size={16} aria-hidden /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      {/* Tab bar bawah untuk layar kecil */}
      <nav className="tabbar" aria-label="Navigasi utama (mobile)">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `tabbar__link ${isActive ? 'is-active' : ''}`}>
            <Icon size={20} aria-hidden />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <footer className="footer">
        <div className="container">
          <span>SkillLearn &copy; {new Date().getFullYear()}</span>
          <span>Belajar keterampilan praktis di luar kelas.</span>
        </div>
      </footer>
    </div>
  );
}
