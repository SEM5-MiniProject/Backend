const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const validateRequest = require("../middleware/validateSchema");
const { userSignupSchema,userLoginSchema } = require('../schema/user.schema');

router.post('/api/signup', validateRequest(userSignupSchema), auth.userSignup);
router.post('/api/login', validateRequest(userLoginSchema), auth.userLogin);



module.exports = router;