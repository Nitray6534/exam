import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as auth from '../controllers/authController.js';
import * as materials from '../controllers/materialController.js';
import * as favorites from '../controllers/favoriteController.js';
import * as history from '../controllers/historyController.js';

const router = Router();

// Membatasi percobaan login/register untuk menahan brute force.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Terlalu banyak percobaan, coba lagi dalam 15 menit' },
});

router.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Auth
router.post('/auth/register', authLimiter, validate(auth.registerSchema), auth.register);
router.post('/auth/login', authLimiter, validate(auth.loginSchema), auth.login);
router.get('/auth/me', requireAuth, auth.me);

// Materi (seluruh materi hanya untuk pengguna yang sudah login)
router.get('/materials', requireAuth, materials.listMaterials);
router.get('/materials/categories', requireAuth, materials.listCategories);
router.get('/materials/:idOrSlug', requireAuth, materials.getMaterial);
router.post(
  '/materials/:idOrSlug/quiz',
  requireAuth,
  validate(materials.quizSchema),
  materials.submitQuiz
);

// Favorit
router.get('/favorites', requireAuth, favorites.listFavorites);
router.post('/favorites/:materialId', requireAuth, favorites.addFavorite);
router.delete('/favorites/:materialId', requireAuth, favorites.removeFavorite);

// Riwayat belajar
router.get('/history', requireAuth, history.listHistory);
router.patch('/history/:materialId', requireAuth, validate(history.progressSchema), history.updateProgress);
router.delete('/history/:materialId', requireAuth, history.removeHistory);
router.delete('/history', requireAuth, history.clearHistory);

export default router;
