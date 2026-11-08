import { ApiError } from '../utils/ApiError.js';

export function notFound(req, _res, next) {
  next(new ApiError(404, `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Terjadi kesalahan';
  const details = err.details;

  if (err.name === 'CastError') {
    status = 400;
    message = 'ID tidak valid';
  } else if (err.code === 11000) {
    status = 409;
    message = 'Data sudah terdaftar';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Format JSON tidak valid';
  } else if (err.type === 'entity.too.large') {
    status = 413;
    message = 'Ukuran request terlalu besar';
  }

  if (status >= 500) {
    console.error(err);
    message = 'Terjadi kesalahan pada server';
  }

  res.status(status).json({ message, ...(details ? { details } : {}) });
}
