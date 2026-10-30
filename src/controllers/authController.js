const jwt = require('jsonwebtoken');
const config = require('../config');
const userService = require('../services/userService');
const { HttpError } = require('../errors');

const wrap = (fn) => (req, res, next) => fn(req, res).catch(next);

const register = wrap(async (req, res) => {
  const user = await userService.register(req.body);
  res.status(201).json({ success: true, message: 'Akun berhasil dibuat', data: user });
});

const login = wrap(async (req, res) => {
  const user = await userService.authenticate(req.body.email, req.body.password);
  const token = jwt.sign({ sub: String(user.id) }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  res.json({ success: true, message: 'Login berhasil', data: { token, tokenType: 'Bearer', expiresIn: config.jwtExpiresIn } });
});

const profile = wrap(async (req, res) => {
  const user = await userService.findById(req.userId);
  if (!user) throw new HttpError(404, 'User tidak ditemukan');
  res.json({ success: true, data: user });
});

module.exports = { register, login, profile };
