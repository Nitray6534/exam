import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Clock, Gauge, User, FileQuestion } from 'lucide-react';
import { api } from '../api/client.js';
import { useToast } from '../context/ToastContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { categoryMeta, typeMeta, formatDuration } from '../lib/meta.js';
import { CategoryTag, CoverArt, EmptyState, ProgressBar, Spinner } from '../components/ui.jsx';
import { ArticleView, PracticeView, QuizView, VideoView } from '../components/MaterialViews.jsx';

const VIEWS = { artikel: ArticleView, video: VideoView, kuis: QuizView, latihan: PracticeView };

export default function Detail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { dark } = useTheme();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setData(null);
    setError(null);
    api
      .material(slug)
      .then((d) => alive && setData(d))
      .catch((err) => alive && setError(err));
    window.scrollTo(0, 0);
    return () => {
      alive = false;
    };
  }, [slug]);

  const onProgress = useCallback(
    async (payload, { silent = false } = {}) => {
      try {
        const res = await api.updateProgress(data.material.id, payload);
        setData((d) => ({ ...d, history: res.history }));
        if (!silent && res.history.completed) toast('Progress tersimpan. Materi selesai!');
      } catch (err) {
        toast(err.message, 'error');
      }
    },
    [data?.material.id, toast]
  );

  const onSubmitQuiz = useCallback(
    async (answers) => {
      const res = await api.submitQuiz(data.material.id, answers);
      setData((d) => ({ ...d, history: res.history }));
      return res;
    },
    [data?.material.id]
  );

  const toggleFavorite = async () => {
    const next = !data.material.isFavorite;
    setData((d) => ({ ...d, material: { ...d.material, isFavorite: next } }));
    try {
      if (next) await api.addFavorite(data.material.id);
      else await api.removeFavorite(data.material.id);
      toast(next ? 'Disimpan ke favorit' : 'Dihapus dari favorit');
    } catch (err) {
      setData((d) => ({ ...d, material: { ...d.material, isFavorite: !next } }));
      toast(err.message, 'error');
    }
  };

  if (error) {
    return (
      <div className="container page">
        <EmptyState
          icon={FileQuestion}
          title={error.status === 404 ? 'Materi tidak ditemukan' : 'Gagal memuat materi'}
          text={error.message}
          action={
            <Link to="/" className="btn btn--secondary">
              Kembali ke beranda
            </Link>
          }
        />
      </div>
    );
  }
  if (!data) return <Spinner label="Memuat materi..." />;

  const { material, history, related } = data;
  const cat = categoryMeta(material.category);
  const View = VIEWS[material.type];
  const progress = history?.progress ?? 0;

  return (
    <div className="container page detail">
      <button type="button" className="back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} aria-hidden /> Kembali
      </button>

      <header className="detail__header">
        <CoverArt category={material.category} type={material.type} size="lg" />
        <div className="detail__intro">
          <div className="detail__tags">
            <CategoryTag category={material.category} />
            <span className="type-tag">{typeMeta(material.type).label}</span>
          </div>
          <h1>{material.title}</h1>
          <p className="detail__summary">{material.summary}</p>
          <div className="detail__meta">
            <span>
              <Gauge size={16} aria-hidden /> {material.level}
            </span>
            <span>
              <Clock size={16} aria-hidden /> {formatDuration(material.durationMinutes)}
            </span>
            <span>
              <User size={16} aria-hidden /> {material.author}
            </span>
          </div>
          <button
            type="button"
            className={`btn ${material.isFavorite ? 'btn--fav-on' : 'btn--secondary'}`}
            aria-pressed={material.isFavorite}
            onClick={toggleFavorite}
          >
            <Heart size={18} fill={material.isFavorite ? 'currentColor' : 'none'} aria-hidden />
            {material.isFavorite ? 'Tersimpan di favorit' : 'Simpan ke favorit'}
          </button>
        </div>
      </header>

      <div className="detail__layout">
        <section className="detail__content">
          <View
            key={material.id}
            material={material}
            history={history}
            onProgress={onProgress}
            onSubmitQuiz={onSubmitQuiz}
          />
        </section>

        <aside className="detail__aside">
          <div className="panel">
            <h3>Progress kamu</h3>
            <div className="panel__progress">
              <strong style={{ color: dark ? cat.fgDark : cat.fg }}>{progress}%</strong>
              <span>{history?.completed ? 'Selesai' : progress > 0 ? 'Sedang dipelajari' : 'Belum dimulai'}</span>
            </div>
            <ProgressBar value={progress} />
            {typeof history?.bestQuizScore === 'number' && (
              <p className="panel__note">Skor kuis terbaik: {history.bestQuizScore}</p>
            )}
          </div>

          {material.tags?.length > 0 && (
            <div className="panel">
              <h3>Topik</h3>
              <div className="tags">
                {material.tags.map((t) => (
                  <Link key={t} to={`/?q=${encodeURIComponent(t)}`}>
                    #{t}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div className="panel">
              <h3>Materi terkait</h3>
              <ul className="related">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link to={`/materi/${r.slug}`}>
                      <CoverArt category={r.category} type={r.type} size="xs" showType={false} />
                      <span>
                        <small>{typeMeta(r.type).label}</small>
                        <strong>{r.title}</strong>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
