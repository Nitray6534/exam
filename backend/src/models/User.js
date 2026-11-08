import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { toJSONOptions } from './toJSON.js';

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
    },
    // Password disimpan dalam bentuk hash bcrypt dan tidak ikut terambil secara default.
    password: { type: String, required: true, select: false },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }],
  },
  {
    timestamps: true,
    toJSON: {
      ...toJSONOptions,
      transform: (doc, ret) => {
        toJSONOptions.transform(doc, ret);
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model('User', userSchema);
