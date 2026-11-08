import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { api } from '../api/client.js';
import { useFavoriteToggle } from '../lib/useFavoriteToggle.js';
import { EmptyState, MaterialCard, Spinner } from '../components/ui.jsx';

export default function Favorites() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toggleFavorite = useFavoriteToggle(setItems, { removeOnUnfavorite: true });

  useEffect(() => {
    api
      .favorites()
      .then((d) => setItems(d.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container page">
      <div className="page-head">
        <span className="eyebrow">Koleksi kamu</span>
        <h1>Materi Favorit</h1>
        <p>Materi yang kamu simpan untuk dipelajari atau dibuka kembali nanti.</p>
      </div>

      {loading ? (
        <Spinner label="Memuat favorit..." />
      ) : error ? (
        <div className="alert alert--error">{error}</div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Belum ada materi favorit"
          text="Tekan ikon hati pada materi untuk menyimpannya di sini."
          action={
            <Link to="/" className="btn btn--primary">
              Jelajahi materi
            </Link>
          }
        />
      ) : (
        <>
          <div className="section-head">
            <h2>
              Tersimpan <span>· {items.length} materi</span>
            </h2>
          </div>
          <div className="grid">
            {items.map((m) => (
              <MaterialCard key={m.id} material={m} onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
