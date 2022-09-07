const express = require('express');
const router = express.Router();
const { UserSignup } = require('../controllers/auth');
const validateRequest = require("../middleware/validateSchema");
const { userSignupSchema } = require('../schema/user.schema');

router.post('/api/signup', validateRequest(userSignupSchema), UserSignup);



module.exports = router;