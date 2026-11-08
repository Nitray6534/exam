import mongoose from 'mongoose';
import { env } from './env.js';

let memoryServer = null;

/**
 * Koneksi ke MongoDB.
 * - Jika MONGODB_URI diisi (misalnya MongoDB Atlas), koneksi memakai URI tersebut.
 * - Jika kosong dan bukan production, server memakai MongoDB in-memory
 *   (mongodb-memory-server) agar aplikasi tetap bisa dijalankan tanpa instalasi MongoDB.
 */
export async function connectDB(uri = env.mongoUri) {
  let target = uri;

  if (!target) {
    if (env.isProduction) {
      throw new Error('MONGODB_URI wajib diisi pada environment production');
    }
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    target = memoryServer.getUri('skilllearn');
    if (env.nodeEnv !== 'test') {
      console.warn('[db] MONGODB_URI kosong, memakai MongoDB in-memory. Data hilang saat server dimatikan.');
    }
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(target, { serverSelectionTimeoutMS: 15000 });
  if (env.nodeEnv !== 'test') {
    console.log(`[db] Terhubung ke MongoDB (${mongoose.connection.name})`);
  }
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
