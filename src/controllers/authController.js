const userService = require('../services/userService');

const wrap = (fn) => (req, res, next) => fn(req, res).catch(next);

const register = wrap(async (req, res) => {
  const user = await userService.register(req.body);
  res.status(201).json({ success: true, message: 'Akun berhasil dibuat', data: user });
});

module.exports = { register };
