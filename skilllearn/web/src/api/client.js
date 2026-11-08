// Wrapper fetch untuk REST API SkillLearn.
// VITE_API_URL kosong berarti API berada di origin yang sama (dev proxy atau Express melayani web).
const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'skilllearn_token';

export const tokenStore = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* storage tidak tersedia */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage tidak tersedia */
    }
  },
};

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function request(path, { method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(`${BASE_URL}/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Tidak dapat terhubung ke server. Periksa koneksi internet kamu.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token) window.dispatchEvent(new Event('skilllearn:unauthorized'));
    throw new ApiError(res.status, data.message || 'Terjadi kesalahan', data.details);
  }
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: () => request('/auth/me'),

  categories: () => request('/materials/categories'),
  materials: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
    return request(`/materials${qs ? `?${qs}` : ''}`);
  },
  material: (idOrSlug) => request(`/materials/${encodeURIComponent(idOrSlug)}`),
  submitQuiz: (idOrSlug, answers) =>
    request(`/materials/${encodeURIComponent(idOrSlug)}/quiz`, { method: 'POST', body: { answers } }),

  favorites: () => request('/favorites'),
  addFavorite: (id) => request(`/favorites/${id}`, { method: 'POST' }),
  removeFavorite: (id) => request(`/favorites/${id}`, { method: 'DELETE' }),

  history: () => request('/history'),
  updateProgress: (id, payload) => request(`/history/${id}`, { method: 'PATCH', body: payload }),
  removeHistory: (id) => request(`/history/${id}`, { method: 'DELETE' }),
  clearHistory: () => request('/history', { method: 'DELETE' }),
};
