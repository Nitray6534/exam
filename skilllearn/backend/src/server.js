import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { createApp } from './app.js';
import { seedDatabase } from './seed/seedData.js';

async function start() {
  await connectDB();

  // Sinkronkan materi dari kode ke database (upsert berdasarkan slug) setiap server start,
  // sehingga materi baru otomatis muncul setelah deploy tanpa menghapus riwayat pengguna.
  if (env.autoSeed) {
    const result = await seedDatabase({ demoUser: env.seedDemoUser });
    console.log(`[seed] ${result.materials} materi disinkronkan`);
  }

  const app = createApp();
  const server = app.listen(env.port, '0.0.0.0', () => {
    console.log(`[server] SkillLearn API berjalan di http://localhost:${env.port}`);
  });

  const shutdown = async (signal) => {
    console.log(`[server] ${signal} diterima, menutup server...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err) => {
  console.error('[server] Gagal start:', err.message);
  process.exit(1);
});
