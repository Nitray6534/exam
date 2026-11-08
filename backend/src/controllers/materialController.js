import mongoose from 'mongoose';
import { z } from 'zod';
import { Material, LIST_FIELDS } from '../models/Material.js';
import { History } from '../models/History.js';
import { User } from '../models/User.js';
import { ApiError, escapeRegex } from '../utils/ApiError.js';
import {
  CATEGORIES,
  CATEGORY_SLUGS,
  LEVELS,
  MATERIAL_TYPES,
  QUIZ_PASS_SCORE,
} from '../utils/constants.js';

const asString = (value) => (typeof value === 'string' ? value.trim() : '');

async function getUserContext(userId, materialIds) {
  const [user, histories] = await Promise.all([
    User.findById(userId).select('favorites').lean(),
    History.find({ user: userId, material: { $in: materialIds } })
      .select('material progress completed')
      .lean(),
  ]);
  if (!user) throw new ApiError(401, 'Akun tidak ditemukan, silakan login kembali');
  return {
    favorites: new Set(user.favorites.map(String)),
    history: new Map(histories.map((h) => [String(h.material), h])),
  };
}

export function toListItem(material, ctx) {
  const json = typeof material.toJSON === 'function' ? material.toJSON() : material;
  const h = ctx?.history.get(json.id);
  return {
    ...json,
    isFavorite: ctx ? ctx.favorites.has(json.id) : false,
    progress: h?.progress ?? 0,
    completed: h?.completed ?? false,
  };
}

// Kunci jawaban kuis tidak pernah dikirim ke client sebelum kuis dikumpulkan.
function toPublicMaterial(material) {
  const json = material.toJSON();
  if (json.type === 'kuis') {
    json.quiz = json.quiz.map(({ question, options }) => ({ question, options }));
  } else {
    delete json.quiz;
  }
  if (json.type !== 'artikel') delete json.blocks;
  if (json.type !== 'video') delete json.video;
  if (json.type !== 'latihan') delete json.practice;
  return json;
}

function findByIdOrSlug(idOrSlug) {
  const query = mongoose.isValidObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
  return Material.findOne(query);
}

// GET /api/materials?category=&type=&level=&q=
export async function listMaterials(req, res) {
  const category = asString(req.query.category);
  const type = asString(req.query.type);
  const level = asString(req.query.level);
  const q = asString(req.query.q).slice(0, 60);

  const filter = {};
  if (CATEGORY_SLUGS.includes(category)) filter.category = category;
  if (MATERIAL_TYPES.includes(type)) filter.type = type;
  if (LEVELS.includes(level)) filter.level = level;
  if (q) {
    const rx = new RegExp(escapeRegex(q), 'i');
    filter.$or = [{ title: rx }, { summary: rx }, { tags: rx }];
  }

  const materials = await Material.find(filter).select(LIST_FIELDS).sort({ order: 1, createdAt: 1 });
  const ctx = await getUserContext(
    req.user.id,
    materials.map((m) => m._id)
  );

  res.json({ total: materials.length, items: materials.map((m) => toListItem(m, ctx)) });
}

// GET /api/materials/categories
export async function listCategories(_req, res) {
  const counts = await Material.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
  const countMap = new Map(counts.map((c) => [c._id, c.count]));
  res.json({
    items: CATEGORIES.map((c) => ({ ...c, count: countMap.get(c.slug) ?? 0 })),
  });
}

// GET /api/materials/:idOrSlug (sekaligus mencatat riwayat akses)
export async function getMaterial(req, res) {
  const material = await findByIdOrSlug(req.params.idOrSlug);
  if (!material) throw new ApiError(404, 'Materi tidak ditemukan');

  const [history, user, related] = await Promise.all([
    History.findOneAndUpdate(
      { user: req.user.id, material: material._id },
      { $set: { lastAccessedAt: new Date() }, $inc: { viewCount: 1 } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    ),
    User.findById(req.user.id).select('favorites').lean(),
    Material.find({ category: material.category, _id: { $ne: material._id } })
      .select(LIST_FIELDS)
      .sort({ order: 1 })
      .limit(3),
  ]);

  const ctx = await getUserContext(
    req.user.id,
    related.map((m) => m._id)
  );

  res.json({
    material: {
      ...toPublicMaterial(material),
      isFavorite: user?.favorites.some((id) => String(id) === material.id) ?? false,
    },
    history: history.toJSON(),
    related: related.map((m) => toListItem(m, ctx)),
  });
}

export const quizSchema = z.object({
  answers: z.array(z.number().int().min(-1).max(10)).max(50),
});

// POST /api/materials/:id/quiz  body: { answers: [indeksOpsi, ...] }
export async function submitQuiz(req, res) {
  const material = await findByIdOrSlug(req.params.idOrSlug);
  if (!material) throw new ApiError(404, 'Materi tidak ditemukan');
  if (material.type !== 'kuis') throw new ApiError(400, 'Materi ini bukan kuis');

  const { answers } = req.body;
  if (answers.length !== material.quiz.length) {
    throw new ApiError(400, `Jawaban harus berisi ${material.quiz.length} pilihan`);
  }

  const results = material.quiz.map((q, i) => ({
    selected: answers[i],
    answerIndex: q.answerIndex,
    correct: answers[i] === q.answerIndex,
    explanation: q.explanation,
  }));
  const correctCount = results.filter((r) => r.correct).length;
  const score = Math.round((correctCount / material.quiz.length) * 100);
  const passed = score >= QUIZ_PASS_SCORE;

  const update = {
    $set: { quizScore: score, lastAccessedAt: new Date() },
    $max: { bestQuizScore: score, progress: 100 },
  };
  if (passed) {
    update.$set.completed = true;
    update.$set.completedAt = new Date();
  }

  const history = await History.findOneAndUpdate(
    { user: req.user.id, material: material._id },
    update,
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );

  res.json({
    score,
    correctCount,
    total: material.quiz.length,
    passed,
    passScore: QUIZ_PASS_SCORE,
    results,
    history: history.toJSON(),
  });
}
