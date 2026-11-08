import mongoose from 'mongoose';
import { CATEGORY_SLUGS, LEVELS, MATERIAL_TYPES } from '../utils/constants.js';
import { toJSONOptions } from './toJSON.js';

// Blok konten artikel: heading, paragraph, list, code, atau tip.
const blockSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ['heading', 'paragraph', 'list', 'code', 'tip'], required: true },
    text: String,
    items: [String],
  },
  { _id: false }
);

const quizQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], validate: (v) => v.length >= 2 },
    answerIndex: { type: Number, required: true },
    explanation: String,
  },
  { _id: false }
);

const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, enum: CATEGORY_SLUGS, required: true, index: true },
    type: { type: String, enum: MATERIAL_TYPES, required: true, index: true },
    level: { type: String, enum: LEVELS, default: 'Pemula' },
    durationMinutes: { type: Number, min: 1, default: 10 },
    summary: { type: String, required: true },
    author: { type: String, default: 'Tim SkillLearn' },
    tags: [String],
    order: { type: Number, default: 0 },

    // Isi khusus per tipe materi
    blocks: [blockSchema], // artikel
    video: {
      youtubeId: String,
      channel: String,
      sourceTitle: String,
      keyPoints: [String],
    },
    quiz: [quizQuestionSchema], // kuis
    practice: {
      goal: String,
      tools: [String],
      steps: [String],
      checklist: [String],
    },
  },
  { timestamps: true, toJSON: toJSONOptions }
);

materialSchema.index({ title: 'text', summary: 'text', tags: 'text' });

export const LIST_FIELDS =
  'title slug category type level durationMinutes summary author tags order createdAt';

export const Material = mongoose.model('Material', materialSchema);
