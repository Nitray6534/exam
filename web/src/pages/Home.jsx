import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, X, ArrowRight, Layers, SearchX, Sparkles } from 'lucide-react';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { CATEGORY_META, TYPE_META, categoryMeta, typeMeta } from '../lib/meta.js';
import { useFavoriteToggle } from '../lib/useFavoriteToggle.js';
import { CoverArt, EmptyState, MaterialCard, ProgressBar, Spinner } from '../components/ui.jsx';

function ContinueCard({ entry }) {
  if (!entry) {
    return (
      <div className="continue continue--empty">
        <Sparkles size={22} aria-hidden />
        <div>
          <strong>Belum ada materi yang dibuka</strong>
          <p>Pilih satu materi di bawah. Progress kamu akan tersimpan otomatis.</p>
        </div>
      </div>
    );
  }
  const m = entry.material;
  return (
    <Link to={`/materi/${m.slug}`} className="continue">
      <CoverArt category={m.category} type={m.type} size="xs" showType={false} />
      <div className="continue__body">
        <span className="eyebrow">Lanjutkan belajar</span>
        <strong>{m.title}</strong>
        <div className="continue__progress">
          <ProgressBar value={entry.progress} size="sm" />
          <span>{entry.progress}%</span>
        </div>
      </div>
      <ArrowRight size={20} aria-hidden className="continue__arrow" />
    </Link>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const category = params.get('kategori') || '';
  const type = params.get('tipe') || '';
  const q = params.get('q') || '';

  const [search, setSearch] = useState(q);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lastEntry, setLastEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toggleFavorite = useFavoriteToggle(setItems);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    Promise.all([api.categories(), api.history()])
      .then(([cats, hist]) => {
        setCategories(cats.items);
        const open = hist.items.filter((h) => !h.completed);
        setLastEntry(open.find((h) => h.progress > 0) ?? open[0] ?? null);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');
    api
      .materials({ category, type, q })
      .then((data) => alive && setItems(data.items))
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [category, type, q]);

  // Debounce input pencarian ke query string
  useEffect(() => {
    const t = setTimeout(() => {
      if (search.trim() !== q) setParam('q', search.trim());
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const total = useMemo(() => categories.reduce((s, c) => s + c.count, 0), [categories]);
  const firstName = user?.name?.split(' ')[0] ?? '';
  const activeCat = category ? categoryMeta(category).name : 'Semua bidang';
  const activeType = type ? typeMeta(type).label.toLowerCase() : 'materi';

  return (
    <div className="container page">
      <section className="hero">
        <div className="hero__text">
          <span className="eyebrow">Beranda</span>
          <h1>Halo, {firstName}. Mau belajar apa hari ini?</h1>
          <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
            <Search size={20} aria-hidden />
            <input
              type="search"
              placeholder="Cari materi, contoh: figma, javascript, funnel"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Cari materi"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} aria-label="Hapus pencarian">
                <X size={18} />
              </button>
            )}
          </form>
        </div>
        <ContinueCard entry={lastEntry} />
      </section>

      <section aria-label="Filter kategori" className="filters">
        <div className="chips" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={!category}
            className={`chip ${!category ? 'is-active' : ''}`}
            onClick={() => setParam('kategori', '')}
          >
            <Layers size={16} aria-hidden /> Semua <span className="chip__count">{total || ''}</span>
          </button>
          {categories.map((c) => {
            const meta = CATEGORY_META[c.slug];
            const Icon = meta.icon;
            const active = category === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                role="tab"
                aria-selected={active}
                className={`chip ${active ? 'is-active' : ''}`}
                style={active ? undefined : { '--chip-fg': meta.fg }}
                onClick={() => setParam('kategori', c.slug)}
              >
                <Icon size={16} aria-hidden /> {c.name} <span className="chip__count">{c.count}</span>
              </button>
            );
          })}
        </div>

        <div className="segmented" role="radiogroup" aria-label="Filter tipe materi">
          {[['', 'Semua tipe'], ...Object.entries(TYPE_META).map(([k, v]) => [k, v.label])].map(
            ([value, label]) => (
              <button
                key={value || 'all'}
                type="button"
                role="radio"
                aria-checked={type === value}
                className={type === value ? 'is-active' : ''}
                onClick={() => setParam('tipe', value)}
              >
                {label}
              </button>
            )
          )}
        </div>
      </section>

      <div className="section-head">
        <h2>
          {activeCat} <span>· {loading ? '...' : `${items.length} ${activeType}`}</span>
        </h2>
      </div>

      {loading ? (
        <Spinner label="Memuat materi..." />
      ) : error ? (
        <div className="alert alert--error">{error}</div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Materi tidak ditemukan"
          text="Coba kata kunci lain atau hapus filter yang sedang aktif."
          action={
            <button type="button" className="btn btn--secondary" onClick={() => (setSearch(''), setParams({}))}>
              Reset filter
            </button>
          }
        />
      ) : (
        <div className="grid">
          {items.map((m) => (
            <MaterialCard key={m.id} material={m} onToggleFavorite={toggleFavorite} />
          ))}
        </div>
      )}
    </div>
  );
}
