export const CATEGORIES = [
  {
    slug: 'pemrograman',
    name: 'Pemrograman',
    description: 'Logika, JavaScript, dan dasar membangun aplikasi.',
  },
  {
    slug: 'desain-grafis',
    name: 'Desain Grafis',
    description: 'Prinsip visual, tipografi, warna, dan Figma.',
  },
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    description: 'Funnel, konten media sosial, SEO, dan analitik.',
  },
  {
    slug: 'teknologi',
    name: 'Teknologi',
    description: 'Internet, cloud, dan keamanan digital sehari-hari.',
  },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

export const MATERIAL_TYPES = ['artikel', 'video', 'kuis', 'latihan'];

export const LEVELS = ['Pemula', 'Menengah', 'Mahir'];

export const QUIZ_PASS_SCORE = 70;
