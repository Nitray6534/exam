import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History as HistoryIcon, Trash2, BookOpen, CircleCheck, Flame, Trophy } from 'lucide-react';
import { api } from '../api/client.js';
import { useToast } from '../context/ToastContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { categoryMeta, typeMeta, timeAgo } from '../lib/meta.js';
import { CoverArt, EmptyState, ProgressBar, Spinner } from '../components/ui.jsx';

function Stat({ icon: Icon, label, value, tone }) {
  return (
    <div className={`stat stat--${tone}`}>
      <span className="stat__icon">
        <Icon size={20} aria-hidden />
      </span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default function History() {
  const toast = useToast();
  const { dark } = useTheme();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = () =>
    api
      .history()
      .then(setData)
      .catch((err) => setError(err.message));

  useEffect(() => {
    load();
  }, []);

  const remove = async (entry) => {
    await api.removeHistory(entry.material.id);
    toast('Riwayat dihapus');
    load();
  };

  const clearAll = async () => {
    if (!window.confirm('Hapus seluruh riwayat belajar? Progress akan direset.')) return;
    await api.clearHistory();
    toast('Seluruh riwayat dihapus');
    load();
  };

  if (error) return <div className="container page alert alert--error">{error}</div>;
  if (!data) return <Spinner label="Memuat riwayat..." />;

  const { stats, items } = data;

  return (
    <div className="container page">
      <div className="page-head page-head--row">
        <div>
          <span className="eyebrow">Perjalanan belajar</span>
          <h1>Riwayat Belajar</h1>
          <p>Semua materi yang pernah kamu buka, lengkap dengan progress terakhir.</p>
        </div>
        {items.length > 0 && (
          <button type="button" className="btn btn--ghost-danger" onClick={clearAll}>
            <Trash2 size={16} aria-hidden /> Hapus semua
          </button>
        )}
      </div>

      <div className="stats">
        <Stat icon={BookOpen} label="Materi dibuka" value={stats.opened} tone="primary" />
        <Stat icon={CircleCheck} label="Selesai" value={stats.completed} tone="green" />
        <Stat icon={Flame} label="Sedang dipelajari" value={stats.inProgress} tone="accent" />
        <Stat
          icon={Trophy}
          label="Rata-rata skor kuis"
          value={stats.averageQuizScore ?? '-'}
          tone="warn"
        />
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="Riwayat masih kosong"
          text="Materi yang kamu buka akan tercatat otomatis di sini."
          action={
            <Link to="/" className="btn btn--primary">
              Mulai belajar
            </Link>
          }
        />
      ) : (
        <ul className="history">
          {items.map((h) => {
            const m = h.material;
            const cat = categoryMeta(m.category);
            return (
              <li key={h.id} className="history__row">
                <CoverArt category={m.category} type={m.type} size="xs" showType={false} />
                <div className="history__main">
                  <span className="history__meta" style={{ color: dark ? cat.fgDark : cat.fg }}>
                    {cat.name} · {typeMeta(m.type).label}
                  </span>
                  <Link to={`/materi/${m.slug}`} className="history__title">
                    {m.title}
                  </Link>
                  <span className="history__time">Dibuka {timeAgo(h.lastAccessedAt)}</span>
                </div>
                <div className="history__progress">
                  {h.completed ? (
                    <span className="pill pill--done">Selesai</span>
                  ) : (
                    <span className="history__percent">{h.progress}%</span>
                  )}
                  <ProgressBar value={h.progress} size="sm" />
                  {typeof h.bestQuizScore === 'number' && <small>Skor terbaik {h.bestQuizScore}</small>}
                </div>
                <div className="history__actions">
                  <Link to={`/materi/${m.slug}`} className="btn btn--secondary btn--sm">
                    {h.completed ? 'Buka lagi' : 'Lanjutkan'}
                  </Link>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Hapus ${m.title} dari riwayat`}
                    onClick={() => remove(h)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
