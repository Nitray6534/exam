import { ApiError } from '../utils/ApiError.js';

// Validasi body request dengan skema Zod. Body yang lolos diganti dengan hasil parse
// (field asing dibuang), sehingga operator MongoDB seperti $gt tidak bisa disisipkan.
export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body ?? {});
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return next(new ApiError(400, details[0]?.message || 'Data tidak valid', details));
  }
  req.body = result.data;
  return next();
};
