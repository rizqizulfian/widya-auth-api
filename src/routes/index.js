const router = require('express').Router();
const ctrl = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

router.post('/auth/register', validateRegister, ctrl.register);
router.post('/auth/login', validateLogin, ctrl.login);
router.get('/profile', authenticate, ctrl.profile);

module.exports = router;
