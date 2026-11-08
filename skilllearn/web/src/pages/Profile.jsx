import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Heart, BookOpen, CircleCheck, Mail, CalendarDays } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { initials } from '../lib/meta.js';

export default function Profile() {
  const { user, stats, refresh, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-';

  return (
    <div className="container page profile">
      <div className="profile__card">
        <span className="avatar avatar--xl">{initials(user?.name)}</span>
        <h1>{user?.name}</h1>
        <p>
          <Mail size={16} aria-hidden /> {user?.email}
        </p>
        <p>
          <CalendarDays size={16} aria-hidden /> Bergabung {joined}
        </p>

        <div className="profile__stats">
          <Link to="/favorit">
            <Heart size={18} aria-hidden />
            <strong>{stats?.favorites ?? 0}</strong>
            <span>Favorit</span>
          </Link>
          <Link to="/riwayat">
            <BookOpen size={18} aria-hidden />
            <strong>{stats?.opened ?? 0}</strong>
            <span>Dibuka</span>
          </Link>
          <Link to="/riwayat">
            <CircleCheck size={18} aria-hidden />
            <strong>{stats?.completed ?? 0}</strong>
            <span>Selesai</span>
          </Link>
        </div>

        <button
          type="button"
          className="btn btn--ghost-danger btn--block"
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
        >
          <LogOut size={18} aria-hidden /> Keluar dari akun
        </button>
      </div>
    </div>
  );
}
