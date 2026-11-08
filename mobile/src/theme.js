// Design token SkillLearn (sama dengan versi web dan desain Figma)
export const colors = {
  pine900: '#0B3B35',
  pine800: '#0F4C45',
  pine700: '#156057',
  pine100: '#DCEDE9',
  pine50: '#EEF6F4',
  coral500: '#FF7A59',
  coral600: '#F0603D',
  coral700: '#B8431F',
  coral100: '#FFE7DF',
  butter300: '#FFD66B',
  butter100: '#FFF4D6',
  green600: '#15803D',
  green100: '#DCFCE7',
  red600: '#C62828',
  red100: '#FDE2E1',
  cream: '#FBF8F3',
  surface: '#FFFFFF',
  line: '#ECE6DA',
  lineStrong: '#DDD4C4',
  ink: '#17201E',
  ink2: '#45504D',
  ink3: '#646F6C',
};

export const font = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
};

export const radius = { sm: 8, md: 14, lg: 22, pill: 999 };

export const CATEGORY_META = {
  pemrograman: { name: 'Pemrograman', icon: 'code', fg: '#2557D6', soft: '#E7EEFF', from: '#3B78F2', to: '#1E3FA8' },
  'desain-grafis': { name: 'Desain Grafis', icon: 'pen-tool', fg: '#B92F63', soft: '#FCE8F0', from: '#EC5C93', to: '#A22259' },
  'digital-marketing': { name: 'Digital Marketing', icon: 'trending-up', fg: '#A35406', soft: '#FFF0DA', from: '#F7AE36', to: '#D46A0A' },
  teknologi: { name: 'Teknologi', icon: 'cpu', fg: '#6337CF', soft: '#EFE9FE', from: '#9168F7', to: '#5320B8' },
};

export const TYPE_META = {
  artikel: { label: 'Artikel', icon: 'file-text' },
  video: { label: 'Video', icon: 'play-circle' },
  kuis: { label: 'Kuis', icon: 'help-circle' },
  latihan: { label: 'Latihan', icon: 'check-square' },
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
