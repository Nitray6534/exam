import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const nodeEnv = process.env.NODE_ENV || 'development';

export const env = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // Daftar origin dipisah koma, contoh: https://skilllearn.vercel.app,http://localhost:5173
  corsOrigin: process.env.CORS_ORIGIN || '*',
  autoSeed: process.env.AUTO_SEED !== 'false',
  seedDemoUser: process.env.SEED_DEMO_USER !== 'false',
  webDist: process.env.WEB_DIST || '',
};

if (!env.jwtSecret) {
  if (env.isProduction) {
    throw new Error('JWT_SECRET wajib diisi pada environment production');
  }
  env.jwtSecret = 'dev-only-secret-ganti-di-production';
  if (nodeEnv !== 'test') {
    console.warn('[env] JWT_SECRET belum diisi, memakai secret development.');
  }
}
