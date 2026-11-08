import { Code, PenTool, TrendingUp, Cpu, ShieldCheck, FileText, CirclePlay, CircleHelp, ListChecks } from 'lucide-react';

// fg/soft untuk tema terang, fgDark/softDark untuk tema gelap, from/to untuk gradient cover.
export const CATEGORY_META = {
  pemrograman: {
    name: 'Pemrograman',
    icon: Code,
    fg: '#2557D6',
    soft: '#E7EEFF',
    fgDark: '#A5C0FF',
    softDark: 'rgba(59, 120, 242, 0.2)',
    from: '#3B78F2',
    to: '#1E3FA8',
  },
  'desain-grafis': {
    name: 'Desain Grafis',
    icon: PenTool,
    fg: '#B92F63',
    soft: '#FCE8F0',
    fgDark: '#F9A8D4',
    softDark: 'rgba(236, 92, 147, 0.2)',
    from: '#EC5C93',
    to: '#A22259',
  },
  'digital-marketing': {
    name: 'Digital Marketing',
    icon: TrendingUp,
    fg: '#A35406',
    soft: '#FFF0DA',
    fgDark: '#FCD34D',
    softDark: 'rgba(247, 174, 54, 0.18)',
    from: '#F7AE36',
    to: '#D46A0A',
  },
  teknologi: {
    name: 'Teknologi',
    icon: Cpu,
    fg: '#0369A1',
    soft: '#E0F2FE',
    fgDark: '#7DD3FC',
    softDark: 'rgba(56, 189, 248, 0.18)',
    from: '#38BDF8',
    to: '#0369A1',
  },
  'keamanan-siber': {
    name: 'Keamanan Siber',
    icon: ShieldCheck,
    fg: '#334155',
    soft: '#E2E8F0',
    fgDark: '#CBD5E1',
    softDark: 'rgba(148, 163, 184, 0.2)',
    from: '#64748B',
    to: '#0F172A',
  },
};

export const TYPE_META = {
  artikel: { label: 'Artikel', icon: FileText },
  video: { label: 'Video', icon: CirclePlay },
  kuis: { label: 'Kuis', icon: CircleHelp },
  latihan: { label: 'Latihan', icon: ListChecks },
};

export const categoryMeta = (slug) => CATEGORY_META[slug] ?? CATEGORY_META.pemrograman;
export const typeMeta = (type) => TYPE_META[type] ?? TYPE_META.artikel;

export function formatDuration(minutes) {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} menit`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} jam ${m} menit` : `${h} jam`;
}

const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'auto' });
export function timeAgo(date) {
  const diff = (new Date(date).getTime() - Date.now()) / 1000;
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [unit, sec] of units) {
    if (Math.abs(diff) >= sec) return rtf.format(Math.round(diff / sec), unit);
  }
  return 'baru saja';
}

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
