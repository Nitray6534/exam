# SkillLearn

Platform belajar keterampilan praktis untuk siswa dan mahasiswa: artikel, video tutorial, kuis, dan latihan praktik di bidang pemrograman, desain grafis, digital marketing, dan teknologi. Pengguna wajib register dan login untuk mengakses materi, bisa menyimpan materi favorit, dan melihat riwayat serta progress belajar.

| Bagian | Teknologi | Folder |
|---|---|---|
| Aplikasi web | React 19, Vite, React Router, Lucide icons | `web/` |
| Aplikasi mobile | React Native 0.88 (Expo SDK 58), React Navigation 7 | `mobile/` |
| Server (REST API) | Node.js, Express 5, Mongoose 9, JWT, bcrypt, Zod, Helmet | `backend/` |
| Database | MongoDB (MongoDB Atlas untuk hosting) | koleksi `users`, `materials`, `histories` |

## Menjalankan di komputer sendiri

Butuh Node.js 20 atau lebih baru.

```bash
npm run install:all        # install dependency backend, web, dan mobile

# 1. Backend (port 5000)
cp backend/.env.example backend/.env   # isi MONGODB_URI, atau kosongkan untuk MongoDB in-memory
npm run dev:api

# 2. Web (port 5173, request /api otomatis diteruskan ke backend)
npm run dev:web            # buka http://localhost:5173

# 3. Mobile (Expo Go)
npm run dev:mobile         # scan QR dengan aplikasi Expo Go di HP (Wi-Fi sama dengan laptop)
```

Jika `MONGODB_URI` dikosongkan, backend memakai MongoDB in-memory (unduhan otomatis sekali di awal) sehingga bisa langsung dicoba tanpa instalasi MongoDB. Materi awal (17 materi) diisi otomatis saat database masih kosong. Akun demo: `demo@skilllearn.app` / `Demo12345`.

Saat development, aplikasi mobile otomatis memakai IP laptop (dari Metro) dengan port 5000. Untuk memakai API hosting, buat `mobile/.env` berisi `EXPO_PUBLIC_API_URL=https://<url-render-anda>`.

Test API: `npm test` (13 integration test, memakai MongoDB in-memory).

## Deploy gratis

1. **MongoDB Atlas**: buat cluster M0 (gratis), buat database user, di Network Access izinkan `0.0.0.0/0`, salin connection string.
2. **Render** (web + API dalam satu service): push folder ini ke GitHub, lalu di Render pilih *New > Blueprint* dan arahkan ke repo. `render.yaml` sudah mengatur build (`npm run build`) dan start (`npm start`). Isi `MONGODB_URI` saat diminta. Setelah deploy, web dan API tersedia di `https://<nama-service>.onrender.com` (API di `/api`).
3. **Mobile (Expo Go via QR)**: di folder `mobile`, isi `.env` dengan `EXPO_PUBLIC_API_URL`, lalu:
   ```bash
   npx eas-cli@latest login
   npx eas-cli@latest init
   npx eas-cli@latest update:configure
   npx eas-cli@latest update --branch preview --message "SkillLearn v1"
   ```
   Halaman update di expo.dev menampilkan QR yang bisa dibuka dengan Expo Go.
4. **APK Android** (opsional): `npx eas-cli@latest build -p android --profile preview` lalu unduh APK dari link yang diberikan.

Render paket gratis akan "tidur" setelah 15 menit tanpa akses, sehingga request pertama bisa butuh sekitar satu menit.

## Struktur

```
backend/   src/{config,models,controllers,routes,middleware,seed}, test/
web/       src/{api,context,components,pages,lib}
mobile/    App.js, src/{api,context,components,screens,lib}, app.json, eas.json
render.yaml
```

## Endpoint utama

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/auth/register` | Daftar akun, mengembalikan JWT |
| POST | `/api/auth/login` | Login, mengembalikan JWT |
| GET | `/api/auth/me` | Profil dan statistik pengguna |
| GET | `/api/materials?category=&type=&q=` | Daftar materi (filter dan pencarian) |
| GET | `/api/materials/categories` | Kategori dan jumlah materi |
| GET | `/api/materials/:idOrSlug` | Detail materi (mencatat riwayat) |
| POST | `/api/materials/:idOrSlug/quiz` | Kirim jawaban kuis, skor dihitung server |
| GET/POST/DELETE | `/api/favorites[/:materialId]` | Kelola favorit |
| GET/PATCH/DELETE | `/api/history[/:materialId]` | Riwayat dan progress belajar |

Semua endpoint selain register, login, dan health membutuhkan header `Authorization: Bearer <token>`.
