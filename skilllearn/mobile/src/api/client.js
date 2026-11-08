import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

const TOKEN_KEY = 'skilllearn_token';
let memoryToken = null;
let onUnauthorized = () => {};

export const tokenStore = {
  async load() {
    try {
      memoryToken = await AsyncStorage.getItem(TOKEN_KEY);
    } catch {
      memoryToken = null;
    }
    return memoryToken;
  },
  async set(token) {
    memoryToken = token;
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* abaikan */
    }
  },
  async clear() {
    memoryToken = null;
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch {
      /* abaikan */
    }
  },
};

export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' };
  if (memoryToken) headers.Authorization = `Bearer ${memoryToken}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  let res;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(0, `Tidak dapat terhubung ke server (${API_URL}). Periksa koneksi internet.`);
  } finally {
    clearTimeout(timer);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && memoryToken) onUnauthorized();
    throw new ApiError(res.status, data.message || 'Terjadi kesalahan');
  }
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: () => request('/auth/me'),

  categories: () => request('/materials/categories'),
  materials: (params = {}) => {
    const qs = Object.entries(params)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
    return request(`/materials${qs ? `?${qs}` : ''}`);
  },
  material: (slug) => request(`/materials/${encodeURIComponent(slug)}`),
  submitQuiz: (id, answers) => request(`/materials/${id}/quiz`, { method: 'POST', body: { answers } }),

  favorites: () => request('/favorites'),
  addFavorite: (id) => request(`/favorites/${id}`, { method: 'POST' }),
  removeFavorite: (id) => request(`/favorites/${id}`, { method: 'DELETE' }),

  history: () => request('/history'),
  updateProgress: (id, payload) => request(`/history/${id}`, { method: 'PATCH', body: payload }),
  removeHistory: (id) => request(`/history/${id}`, { method: 'DELETE' }),
  clearHistory: () => request('/history', { method: 'DELETE' }),
};
