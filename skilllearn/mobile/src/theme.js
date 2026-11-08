// Design token SkillLearn (sama dengan versi web dan desain Figma).
// Setiap palet memakai nama key yang sama agar style cukup ditulis sekali.
export const palettes = {
  light: {
    dark: false,
    bg: '#F8F7FC',
    surface: '#FFFFFF',
    surface2: '#F3F1FA',
    line: '#E7E3F1',
    lineStrong: '#D5CFE4',
    text: '#1B1630',
    text2: '#4A4562',
    text3: '#625D79',
    placeholder: '#8E89A3',

    primary: '#5B21B6',
    primaryHover: '#4C1D95',
    primary700: '#6D28D9',
    primarySoft: '#EDE9FE',
    primarySofter: '#F5F3FF',
    primaryText: '#5B21B6',
    panel: '#5B21B6',
    highlight: '#5EEAD4',

    accent: '#14B8A6',
    accentStrong: '#0D9488',
    accentSoft: '#CCFBF1',
    accentText: '#0F766E',

    success: '#15803D',
    successBg: '#DCFCE7',
    successText: '#14532D',
    danger: '#C62828',
    dangerBg: '#FDE2E1',
    dangerText: '#8F1D1D',
    dangerBorder: '#F3C7C5',
    warnBg: '#FFF4D6',
    warnBorder: '#F5E1A4',
    warnIcon: '#A16207',

    overlay: 'rgba(255,255,255,0.96)',
    segmentBg: '#EFECF6',
    codeBg: '#1E1A2E',
    codeText: '#ECE8F8',
    toastBg: '#1B1630',
    toastText: '#FFFFFF',
    toastOk: '#6EE7B7',
    toastErr: '#FCA5A5',
    avatarBg: '#14B8A6',
    avatarText: '#0F1F1C',
  },
  dark: {
    dark: true,
    bg: '#12101C',
    surface: '#1C1929',
    surface2: '#241F35',
    line: '#2E2942',
    lineStrong: '#3D3656',
    text: '#EEEBF7',
    text2: '#BDB7D1',
    text3: '#9A94B0',
    placeholder: '#7A7491',

    primary: '#7C3AED',
    primaryHover: '#6D28D9',
    primary700: '#8B5CF6',
    primarySoft: 'rgba(139,92,246,0.2)',
    primarySofter: 'rgba(139,92,246,0.12)',
    primaryText: '#C4B5FD',
    panel: '#4C1D95',
    highlight: '#5EEAD4',

    accent: '#2DD4BF',
    accentStrong: '#14B8A6',
    accentSoft: 'rgba(45,212,191,0.15)',
    accentText: '#5EEAD4',

    success: '#4ADE80',
    successBg: 'rgba(34,197,94,0.16)',
    successText: '#86EFAC',
    danger: '#F87171',
    dangerBg: 'rgba(239,68,68,0.16)',
    dangerText: '#FCA5A5',
    dangerBorder: 'rgba(248,113,113,0.4)',
    warnBg: 'rgba(250,204,21,0.12)',
    warnBorder: 'rgba(250,204,21,0.3)',
    warnIcon: '#FACC15',

    overlay: 'rgba(28,25,41,0.94)',
    segmentBg: '#241F35',
    codeBg: '#0D0B14',
    codeText: '#ECE8F8',
    toastBg: '#F1EEFA',
    toastText: '#1B1630',
    toastOk: '#059669',
    toastErr: '#DC2626',
    avatarBg: '#14B8A6',
    avatarText: '#0F1F1C',
  },
};

export const font = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
};

export const radius = { sm: 8, md: 14, lg: 22, pill: 999 };

// fg/soft untuk tema terang, fgDark/softDark untuk tema gelap, from/to untuk gradient cover.
export const CATEGORY_META = {
  pemrograman: { name: 'Pemrograman', icon: 'code', fg: '#2557D6', soft: '#E7EEFF', fgDark: '#A5C0FF', softDark: 'rgba(59,120,242,0.2)', from: '#3B78F2', to: '#1E3FA8' },
  'desain-grafis': { name: 'Desain Grafis', icon: 'pen-tool', fg: '#B92F63', soft: '#FCE8F0', fgDark: '#F9A8D4', softDark: 'rgba(236,92,147,0.2)', from: '#EC5C93', to: '#A22259' },
  'digital-marketing': { name: 'Digital Marketing', icon: 'trending-up', fg: '#A35406', soft: '#FFF0DA', fgDark: '#FCD34D', softDark: 'rgba(247,174,54,0.18)', from: '#F7AE36', to: '#D46A0A' },
  teknologi: { name: 'Teknologi', icon: 'cpu', fg: '#0369A1', soft: '#E0F2FE', fgDark: '#7DD3FC', softDark: 'rgba(56,189,248,0.18)', from: '#38BDF8', to: '#0369A1' },
  'keamanan-siber': { name: 'Keamanan Siber', icon: 'shield', fg: '#334155', soft: '#E2E8F0', fgDark: '#CBD5E1', softDark: 'rgba(148,163,184,0.2)', from: '#64748B', to: '#0F172A' },
};

export const TYPE_META = {
  artikel: { label: 'Artikel', icon: 'file-text' },
  video: { label: 'Video', icon: 'play-circle' },
  kuis: { label: 'Kuis', icon: 'help-circle' },
  latihan: { label: 'Latihan', icon: 'check-square' },
};

export const categoryMeta = (slug) => CATEGORY_META[slug] ?? CATEGORY_META.pemrograman;
export const typeMeta = (type) => TYPE_META[type] ?? TYPE_META.artikel;

// Warna teks dan latar tag kategori sesuai tema aktif.
export const categoryColors = (slug, dark) => {
  const c = categoryMeta(slug);
  return { ...c, fg: dark ? c.fgDark : c.fg, soft: dark ? c.softDark : c.soft };
};

export function formatDuration(minutes) {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} menit`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} jam ${m} menit` : `${h} jam`;
}

export function timeAgo(date) {
  const diff = Math.round((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return 'baru saja';
  const units = [
    ['tahun', 31536000],
    ['bulan', 2592000],
    ['minggu', 604800],
    ['hari', 86400],
    ['jam', 3600],
    ['menit', 60],
  ];
  for (const [label, sec] of units) {
    if (diff >= sec) return `${Math.floor(diff / sec)} ${label} lalu`;
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
