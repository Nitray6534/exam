import { Code, PenTool, TrendingUp, Cpu, FileText, CirclePlay, CircleHelp, ListChecks } from 'lucide-react';

export const CATEGORY_META = {
  pemrograman: {
    name: 'Pemrograman',
    icon: Code,
    fg: '#2557D6',
    soft: '#E7EEFF',
    from: '#3B78F2',
    to: '#1E3FA8',
  },
  'desain-grafis': {
    name: 'Desain Grafis',
    icon: PenTool,
    fg: '#B92F63',
    soft: '#FCE8F0',
    from: '#EC5C93',
    to: '#A22259',
  },
  'digital-marketing': {
    name: 'Digital Marketing',
    icon: TrendingUp,
    fg: '#A35406',
    soft: '#FFF0DA',
    from: '#F7AE36',
    to: '#D46A0A',
  },
  teknologi: {
    name: 'Teknologi',
    icon: Cpu,
    fg: '#6337CF',
    soft: '#EFE9FE',
    from: '#9168F7',
    to: '#5320B8',
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
