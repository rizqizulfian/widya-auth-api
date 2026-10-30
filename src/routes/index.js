const router = require('express').Router();
const ctrl = require('../controllers/authController');
const { validateRegister } = require('../middleware/validate');

router.post('/auth/register', validateRegister, ctrl.register);

module.exports = router;
