const router = require('express').Router();

const   loginController = require('../controllers/auth/loginController');
const   registerController = require('../controllers/auth/registerController');
const logoutController = require('../controllers/auth/logoutController');



router.use('/login',loginController);
router.use('/register',registerController);
router.use('/logout',logoutController);

module.exports = router;
