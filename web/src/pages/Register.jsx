import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, CircleAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Field from '../components/Field.jsx';
import AuthLayout from './AuthLayout.jsx';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Za-z]/.test(pw) && /[0-9]/.test(pw)) score += 1;
  if (pw.length >= 12 || /[^A-Za-z0-9]/.test(pw)) score += 1;
  return [
    { label: 'Terlalu lemah', level: 0 },
    { label: 'Lemah', level: 1 },
    { label: 'Cukup', level: 2 },
    { label: 'Kuat', level: 3 },
  ][score];
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const strength = useMemo(() => passwordStrength(form.password), [form.password]);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Nama minimal 2 karakter';
    if (!EMAIL_RX.test(form.email.trim())) next.email = 'Masukkan email yang valid';
    if (form.password.length < 8) next.password = 'Password minimal 8 karakter';
    else if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password))
      next.password = 'Password harus mengandung huruf dan angka';
    if (form.confirm !== form.password) next.confirm = 'Konfirmasi password tidak sama';
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    setServerError('');
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Buat akun baru" subtitle="Gratis. Daftar sekali, akses semua materi.">
      {serverError && (
        <div className="alert alert--error" role="alert">
          <CircleAlert size={18} aria-hidden /> {serverError}
        </div>
      )}
      <form onSubmit={onSubmit} noValidate className="form">
        <Field
          label="Nama lengkap"
          icon={User}
          placeholder="Contoh: Dony Pratama"
          autoComplete="name"
          value={form.name}
          onChange={update('name')}
          error={errors.name}
        />
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
          placeholder="Minimal 8 karakter"
          autoComplete="new-password"
          value={form.password}
          onChange={update('password')}
          error={errors.password}
          hint="Gunakan kombinasi huruf dan angka"
        />
        {form.password && (
          <div className={`strength strength--${strength.level}`} aria-live="polite">
            <div className="strength__bars">
              {[1, 2, 3].map((n) => (
                <span key={n} className={strength.level >= n ? 'on' : ''} />
              ))}
            </div>
            <span>Kekuatan password: {strength.label}</span>
          </div>
        )}
        <Field
          label="Konfirmasi password"
          type="password"
          icon={Lock}
          placeholder="Ulangi password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={update('confirm')}
          error={errors.confirm}
        />
        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? 'Membuat akun...' : 'Daftar'}
        </button>
      </form>
      <p className="auth__switch">
        Sudah punya akun? <Link to="/login">Masuk</Link>
      </p>
    </AuthLayout>
  );
}
