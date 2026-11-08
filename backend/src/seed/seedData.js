import { Material } from '../models/Material.js';
import { User } from '../models/User.js';
import { History } from '../models/History.js';
import { materials } from './materials.js';

export const DEMO_USER = {
  name: 'Demo SkillLearn',
  email: 'demo@skilllearn.app',
  password: 'Demo12345',
};

/**
 * Mengisi database dengan materi awal (upsert berdasarkan slug) dan akun demo.
 * @param {{ onlyIfEmpty?: boolean, reset?: boolean, demoUser?: boolean }} options
 */
export async function seedDatabase({ onlyIfEmpty = false, reset = false, demoUser = true } = {}) {
  if (onlyIfEmpty && (await Material.estimatedDocumentCount()) > 0) {
    return { seeded: false, materials: 0 };
  }

  if (reset) {
    await Promise.all([Material.deleteMany({}), History.deleteMany({})]);
  }

  await Material.bulkWrite(
    materials.map((m) => ({
      updateOne: { filter: { slug: m.slug }, update: { $set: m }, upsert: true },
    }))
  );
  await Material.syncIndexes();

  if (demoUser && !(await User.exists({ email: DEMO_USER.email }))) {
    await User.create(DEMO_USER);
  }

  return { seeded: true, materials: materials.length };
}
