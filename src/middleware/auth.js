const jwt = require('jsonwebtoken');
const config = require('../config');
const { HttpError } = require('../errors');

function authenticate(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new HttpError(401, 'Header Authorization: Bearer <token> diperlukan'));
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.userId = Number(payload.sub);
    next();
  } catch {
    next(new HttpError(401, 'Token tidak valid atau kedaluwarsa'));
  }
}

module.exports = { authenticate };
