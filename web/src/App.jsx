import { Link, Route, Routes } from 'react-router-dom';
import { Compass } from 'lucide-react';
import AppLayout from './components/AppLayout.jsx';
import { ProtectedRoute, PublicOnlyRoute } from './components/RouteGuards.jsx';
import { EmptyState } from './components/ui.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Detail from './pages/Detail.jsx';
import Favorites from './pages/Favorites.jsx';
import History from './pages/History.jsx';
import Profile from './pages/Profile.jsx';

function NotFound() {
  return (
    <div className="container page">
      <EmptyState
        icon={Compass}
        title="Halaman tidak ditemukan"
        text="Alamat yang kamu buka tidak tersedia."
        action={
          <Link to="/" className="btn btn--primary">
            Kembali ke beranda
          </Link>
        }
      />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="/materi/:slug" element={<Detail />} />
          <Route path="/favorit" element={<Favorites />} />
          <Route path="/riwayat" element={<History />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
