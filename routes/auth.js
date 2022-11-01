const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
router.get('/signup', authController.userSignupGet);
router.post('/signup', authController.userSignupPost);
router.get('/signin', authController.userSigninGet);
router.post('/signin', authController.userSigninPost);
router.get('/logout', authController.userLogout);
module.exports = router;
