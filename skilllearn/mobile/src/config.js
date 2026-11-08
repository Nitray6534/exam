import Constants from 'expo-constants';

/**
 * Menentukan alamat REST API.
 * 1. EXPO_PUBLIC_API_URL (file .env), contoh: https://skilllearn-api.onrender.com
 * 2. Saat development dengan Expo Go di jaringan Wi-Fi yang sama, IP laptop diambil
 *    otomatis dari hostUri Metro, lalu dipakai port 5000 (backend Express).
 * 3. Fallback: http://localhost:5000
 */
function devHostUrl() {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) return null;
  const host = hostUri.split(':')[0];
  if (!host || host.endsWith('.exp.direct')) return null; // mode tunnel tidak bisa ke port 5000
  return `http://${host}:5000`;
}

export const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ||
  (__DEV__ ? devHostUrl() : null) ||
  'http://localhost:5000'
).replace(/\/$/, '');
