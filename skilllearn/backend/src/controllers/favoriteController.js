import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Material, LIST_FIELDS } from '../models/Material.js';
import { History } from '../models/History.js';
import { ApiError } from '../utils/ApiError.js';
import { toListItem } from './materialController.js';

function assertId(id) {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'ID materi tidak valid');
}

// GET /api/favorites
export async function listFavorites(req, res) {
  const user = await User.findById(req.user.id).populate({ path: 'favorites', select: LIST_FIELDS });
  if (!user) throw new ApiError(401, 'Akun tidak ditemukan');

  const materials = user.favorites.filter(Boolean).reverse(); // terbaru di atas
  const histories = await History.find({
    user: user._id,
    material: { $in: materials.map((m) => m._id) },
  }).lean();
  const ctx = {
    favorites: new Set(materials.map((m) => m.id)),
    history: new Map(histories.map((h) => [String(h.material), h])),
  };

  res.json({ total: materials.length, items: materials.map((m) => toListItem(m, ctx)) });
}

// POST /api/favorites/:materialId
export async function addFavorite(req, res) {
  const { materialId } = req.params;
  assertId(materialId);
  if (!(await Material.exists({ _id: materialId }))) throw new ApiError(404, 'Materi tidak ditemukan');

  await User.updateOne({ _id: req.user.id }, { $addToSet: { favorites: materialId } });
  res.status(201).json({ materialId, isFavorite: true });
}

// DELETE /api/favorites/:materialId
export async function removeFavorite(req, res) {
  const { materialId } = req.params;
  assertId(materialId);
  await User.updateOne({ _id: req.user.id }, { $pull: { favorites: materialId } });
  res.json({ materialId, isFavorite: false });
}
