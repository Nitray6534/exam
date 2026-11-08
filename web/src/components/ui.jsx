import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { categoryMeta, typeMeta, formatDuration } from '../lib/meta.js';

export function Logo({ light = false }) {
  return (
    <span className={`logo ${light ? 'logo--light' : ''}`}>
      <svg viewBox="0 0 64 64" width="32" height="32" aria-hidden>
        <rect width="64" height="64" rx="16" fill={light ? '#FFFFFF' : '#0F4C45'} />
        <path
          d="M20 40c0 4 4 7 12 7s12-3 12-8c0-11-24-6-24-16 0-4 4-7 11-7 6 0 10 2 11 6"
          fill="none"
          stroke={light ? '#0F4C45' : '#FFFFFF'}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="47" cy="17" r="5" fill="#FF7A59" />
      </svg>
      <span className="logo__text">
        Skill<span>Learn</span>
      </span>
    </span>
  );
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
  const cat = categoryMeta(category);
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
