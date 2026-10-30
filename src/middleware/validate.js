const { HttpError } = require('../errors');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENDERS = ['male', 'female'];

function validateRegister(req, res, next) {
  const { name, email, gender, password } = req.body || {};
  const errors = {};

  if (typeof name !== 'string' || !name.trim() || name.length > 100) errors.name = 'name wajib diisi (maks 100 karakter)';
  if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 255) errors.email = 'email tidak valid';
  if (!GENDERS.includes(gender)) errors.gender = `gender harus salah satu dari: ${GENDERS.join(', ')}`;
  if (typeof password !== 'string' || password.length < 8 || password.length > 72) errors.password = 'password 8-72 karakter';

  if (Object.keys(errors).length) return next(new HttpError(400, 'Validasi gagal', errors));

  req.body = { name: name.trim(), email: email.toLowerCase().trim(), gender, password };
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return next(new HttpError(400, 'Validasi gagal', { credentials: 'email dan password wajib diisi' }));
  }
  req.body = { email: email.toLowerCase().trim(), password };
  next();
}

module.exports = { validateRegister, validateLogin };
