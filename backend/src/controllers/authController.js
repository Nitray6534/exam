import { z } from 'zod';
import { User } from '../models/User.js';
import { History } from '../models/History.js';
import { signToken } from '../middleware/auth.js';
import { ApiError } from '../utils/ApiError.js';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(60, 'Nama maksimal 60 karakter'),
  email: z.string().trim().toLowerCase().pipe(z.email('Format email tidak valid')),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(72, 'Password maksimal 72 karakter')
    .regex(/[A-Za-z]/, 'Password harus mengandung huruf')
    .regex(/[0-9]/, 'Password harus mengandung angka'),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email('Format email tidak valid')),
  password: z.string().min(1, 'Password wajib diisi').max(72),
});

const authResponse = (user) => ({ token: signToken(user.id), user: user.toJSON() });

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (await User.exists({ email })) {
    throw new ApiError(409, 'Email sudah terdaftar, silakan login');
  }

  const user = await User.create({ name, email, password });
  res.status(201).json(authResponse(user));
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  // Pesan dibuat sama agar tidak membocorkan email mana yang terdaftar.
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Email atau password salah');
  }

  res.json(authResponse(user));
}

export async function me(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(401, 'Akun tidak ditemukan, silakan login kembali');

  const [opened, completed] = await Promise.all([
    History.countDocuments({ user: user._id }),
    History.countDocuments({ user: user._id, completed: true }),
  ]);

  res.json({
    user: user.toJSON(),
    stats: { favorites: user.favorites.length, opened, completed },
  });
}
