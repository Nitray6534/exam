import { Link } from 'react-router-dom';
import { Heart, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { categoryMeta, typeMeta, formatDuration } from '../lib/meta.js';

export function Logo({ light = false }) {
  return (
    <span className={`logo ${light ? 'logo--light' : ''}`}>
      <svg viewBox="0 0 64 64" width="32" height="32" aria-hidden>
        <rect width="64" height="64" rx="16" fill={light ? '#FFFFFF' : '#5B21B6'} />
        <path
          d="M32 9 L50 15.5 V30 C50 42.5 42.2 50.6 32 55 C21.8 50.6 14 42.5 14 30 V15.5 Z"
          fill={light ? '#5B21B6' : '#FFFFFF'}
        />
        <path d="M31 25.5 C27.6 23.6 23.8 23.2 20.5 24 V40.5 C23.8 39.7 27.6 40.1 31 42 Z" fill={light ? '#FFFFFF' : '#5B21B6'} />
        <path d="M33 25.5 C36.4 23.6 40.2 23.2 43.5 24 V40.5 C40.2 39.7 36.4 40.1 33 42 Z" fill="#14B8A6" />
      </svg>
      <span className="logo__text">
        Skill<span>Learn</span>
      </span>
    </span>
  );
}

export function ThemeToggle({ className = '' }) {
  const { dark, toggle } = useTheme();
  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={toggle}
      aria-label={dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      title={dark ? 'Mode terang' : 'Mode gelap'}
    >
      {dark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </button>
  );
}

// Warna teks kategori menyesuaikan tema terang/gelap.
export function useCategoryColors(category) {
  const { dark } = useTheme();
  const cat = categoryMeta(category);
  return { ...cat, fg: dark ? cat.fgDark : cat.fg, soft: dark ? cat.softDark : cat.soft };
}

export function ProgressBar({ value = 0, size = 'md', label }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`progress progress--${size}`}
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || 'Progress belajar'}
    >
      <span style={{ width: `${v}%` }} />
    </div>
  );
}

export function Spinner({ label = 'Memuat...' }) {
  return (
    <div className="spinner-wrap" role="status">
      <span className="spinner" aria-hidden />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="empty">
      <div className="empty__icon">{Icon && <Icon size={28} aria-hidden />}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

// Cover visual materi: gradasi warna kategori + ikon kategori + badge tipe.
export function CoverArt({ category, type, size = 'md', showType = true }) {
  const cat = categoryMeta(category);
  const t = typeMeta(type);
  const CatIcon = cat.icon;
  const TypeIcon = t.icon;
  return (
    <div
      className={`cover cover--${size}`}
      style={{ background: `linear-gradient(135deg, ${cat.from}, ${cat.to})` }}
      aria-hidden
    >
      <div className="cover__dots" />
      <CatIcon className="cover__icon" strokeWidth={1.4} />
      {showType && (
        <span className="cover__badge">
          <TypeIcon size={14} strokeWidth={2.2} />
          {t.label}
        </span>
      )}
    </div>
  );
}

export function CategoryTag({ category }) {
  const cat = useCategoryColors(category);
  return (
    <span className="cat-tag" style={{ color: cat.fg, background: cat.soft }}>
      {cat.name}
    </span>
  );
}

export function MaterialCard({ material, onToggleFavorite }) {
  const { slug, title, summary, category, type, level, durationMinutes, isFavorite, progress, completed } =
    material;
  return (
    <article className="card">
      <Link to={`/materi/${slug}`} className="card__link" aria-label={title}>
        <CoverArt category={category} type={type} />
        <div className="card__body">
          <CategoryTag category={category} />
          <h3 className="card__title">{title}</h3>
          <p className="card__summary">{summary}</p>
          <div className="card__meta">
            <span>{level}</span>
            <span aria-hidden>·</span>
            <span>{formatDuration(durationMinutes)}</span>
            {completed && <span className="pill pill--done">Selesai</span>}
          </div>
          {progress > 0 && !completed && (
            <div className="card__progress">
              <ProgressBar value={progress} size="sm" />
              <span>{progress}%</span>
            </div>
          )}
        </div>
      </Link>
      {onToggleFavorite && (
        <button
          type="button"
          className={`fav-btn ${isFavorite ? 'is-active' : ''}`}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'}
          onClick={() => onToggleFavorite(material)}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      )}
    </article>
  );
}
