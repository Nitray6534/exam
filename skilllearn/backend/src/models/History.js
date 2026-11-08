import mongoose from 'mongoose';
import { toJSONOptions } from './toJSON.js';

// Riwayat belajar: satu dokumen per pasangan (user, materi).
const historySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    completed: { type: Boolean, default: false },
    completedAt: Date,
    quizScore: { type: Number, min: 0, max: 100 },
    bestQuizScore: { type: Number, min: 0, max: 100 },
    checkedSteps: [Number], // indeks checklist latihan yang sudah dicentang
    viewCount: { type: Number, default: 0 },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, toJSON: toJSONOptions }
);

historySchema.index({ user: 1, material: 1 }, { unique: true });
historySchema.index({ user: 1, lastAccessedAt: -1 });

export const History = mongoose.model('History', historySchema);
