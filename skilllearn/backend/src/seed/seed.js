// Jalankan: npm run seed   (atau npm run seed:reset untuk menghapus materi & riwayat lama)
import { env } from '../config/env.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { seedDatabase, DEMO_USER } from './seedData.js';

const reset = process.argv.includes('--reset');

try {
  if (!env.mongoUri) {
    console.error('Isi MONGODB_URI di file .env terlebih dahulu sebelum menjalankan seed.');
    process.exit(1);
  }
  await connectDB();
  const result = await seedDatabase({ reset, demoUser: env.seedDemoUser });
  console.log(`[seed] ${result.materials} materi tersimpan${reset ? ' (reset)' : ''}.`);
  if (env.seedDemoUser) console.log(`[seed] Akun demo: ${DEMO_USER.email} / ${DEMO_USER.password}`);
} catch (err) {
  console.error('[seed] Gagal:', err.message);
  process.exitCode = 1;
} finally {
  await disconnectDB();
}
