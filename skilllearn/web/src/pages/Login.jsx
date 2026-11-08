import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, CircleAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Field from '../components/Field.jsx';
import AuthLayout from './AuthLayout.jsx';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!EMAIL_RX.test(form.email.trim())) next.email = 'Masukkan email yang valid';
    if (!form.password) next.password = 'Password wajib diisi';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    setServerError('');
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Masuk ke SkillLearn" subtitle="Lanjutkan belajar dari materi terakhir kamu.">
      {location.state?.registered && (
        <div className="alert alert--success">Akun berhasil dibuat. Silakan masuk.</div>
      )}
      {serverError && (
        <div className="alert alert--error" role="alert">
          <CircleAlert size={18} aria-hidden /> {serverError}
        </div>
      )}
      <form onSubmit={onSubmit} noValidate className="form">
        <Field
          label="Email"
          type="email"
          icon={Mail}
          placeholder="nama@email.com"
          autoComplete="email"
          value={form.email}
          onChange={update('email')}
          error={errors.email}
        />
        <Field
          label="Password"
          type="password"
          icon={Lock}
          placeholder="Masukkan password"
          autoComplete="current-password"
          value={form.password}
          onChange={update('password')}
          error={errors.password}
        />
        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
      <p className="auth__switch">
        Belum punya akun? <Link to="/register">Daftar sekarang</Link>
      </p>
    </AuthLayout>
  );
}
