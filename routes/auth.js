const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { checkauth } = require('../middleware/checkauth');

router.get('/signup', checkauth, authController.userSignupGet);
router.post('/signup', checkauth, authController.userSignupPost);
router.get('/signin', checkauth, authController.userSigninGet);
router.post('/signin', checkauth, authController.userSigninPost);
router.get('/logout', authController.userLogout);

module.exports = router;
