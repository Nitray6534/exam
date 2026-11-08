import { Code, PenTool, TrendingUp, Cpu, CircleCheck } from 'lucide-react';
import { Logo } from '../components/ui.jsx';

const FLOATING = [
  { icon: Code, label: 'Pemrograman', color: '#3B78F2', title: 'Variabel & Tipe Data' },
  { icon: PenTool, label: 'Desain Grafis', color: '#EC5C93', title: 'Prinsip Hierarki' },
  { icon: TrendingUp, label: 'Digital Marketing', color: '#F7AE36', title: 'Funnel Pemasaran' },
  { icon: Cpu, label: 'Teknologi', color: '#9168F7', title: 'Cara Kerja Internet' },
];

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth">
      <aside className="auth__panel">
        <Logo light />
        <div className="auth__pitch">
          <h2>Skill praktis, dipelajari dengan ritmemu sendiri.</h2>
          <p>
            Artikel, video tutorial, kuis, dan latihan praktik di bidang pemrograman, desain grafis,
            digital marketing, dan teknologi.
          </p>
          <ul className="auth__points">
            <li>
              <CircleCheck size={18} aria-hidden /> Simpan materi favorit
            </li>
            <li>
              <CircleCheck size={18} aria-hidden /> Pantau riwayat dan progress belajar
            </li>
            <li>
              <CircleCheck size={18} aria-hidden /> Uji pemahaman lewat kuis interaktif
            </li>
          </ul>
        </div>
        <div className="auth__stack" aria-hidden>
          {FLOATING.map(({ icon: Icon, label, color, title: t }, i) => (
            <div key={label} className="mini-card" style={{ '--i': i }}>
              <span className="mini-card__icon" style={{ background: color }}>
                <Icon size={16} color="#fff" />
              </span>
              <span>
                <small>{label}</small>
                <strong>{t}</strong>
              </span>
            </div>
          ))}
        </div>
      </aside>

      <section className="auth__form-wrap">
        <div className="auth__form">
          <div className="auth__logo-mobile">
            <Logo />
          </div>
          <h1>{title}</h1>
          <p className="auth__subtitle">{subtitle}</p>
          {children}
        </div>
      </section>
    </div>
  );
}
