import mongoose from 'mongoose';
import { z } from 'zod';
import { History } from '../models/History.js';
import { Material, LIST_FIELDS } from '../models/Material.js';
import { ApiError } from '../utils/ApiError.js';

function assertId(id) {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'ID materi tidak valid');
}

// GET /api/history
export async function listHistory(req, res) {
  const entries = await History.find({ user: req.user.id })
    .sort({ lastAccessedAt: -1 })
    .populate({ path: 'material', select: LIST_FIELDS });

  const items = entries.filter((e) => e.material).map((e) => e.toJSON());
  const scores = items.map((i) => i.bestQuizScore).filter((s) => typeof s === 'number');

  res.json({
    total: items.length,
    stats: {
      opened: items.length,
      completed: items.filter((i) => i.completed).length,
      inProgress: items.filter((i) => !i.completed && i.progress > 0).length,
      averageQuizScore: scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : null,
      totalMinutes: items
        .filter((i) => i.completed)
        .reduce((sum, i) => sum + (i.material.durationMinutes || 0), 0),
    },
    items,
  });
}

export const progressSchema = z.object({
  progress: z.number().int().min(0).max(100).optional(),
  completed: z.boolean().optional(),
  checkedSteps: z.array(z.number().int().min(0).max(50)).max(50).optional(),
});

// PATCH /api/history/:materialId  body: { progress?, completed?, checkedSteps? }
export async function updateProgress(req, res) {
  const { materialId } = req.params;
  assertId(materialId);
  if (!(await Material.exists({ _id: materialId }))) throw new ApiError(404, 'Materi tidak ditemukan');

  const { progress, completed, checkedSteps } = req.body;
  const update = { $set: { lastAccessedAt: new Date() } };

  if (Array.isArray(checkedSteps)) update.$set.checkedSteps = [...new Set(checkedSteps)];
  if (typeof progress === 'number') update.$set.progress = progress;
  if (completed === true || progress === 100) {
    update.$set.completed = true;
    update.$set.completedAt = new Date();
    update.$set.progress = 100;
  } else if (completed === false) {
    update.$set.completed = false;
    update.$unset = { completedAt: '' };
  }

  const history = await History.findOneAndUpdate(
    { user: req.user.id, material: materialId },
    update,
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
  res.json({ history: history.toJSON() });
}

// DELETE /api/history/:materialId
export async function removeHistory(req, res) {
  const { materialId } = req.params;
  assertId(materialId);
  await History.deleteOne({ user: req.user.id, material: materialId });
  res.json({ removed: true });
}

// DELETE /api/history
export async function clearHistory(req, res) {
  const { deletedCount } = await History.deleteMany({ user: req.user.id });
  res.json({ removed: deletedCount });
}
