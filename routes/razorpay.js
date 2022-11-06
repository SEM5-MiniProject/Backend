const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { checkIfUser } = require('../middleware/requiredUser');
const checkMongooseId = require('../middleware/mongooseId');
const { verifyPost, buySinglePost, cartPost } = require('../controllers/razorpay');

router.post('/verify', verifyPost)
router.post('/cart', auth, checkIfUser, cartPost)
router.post('/:id', checkMongooseId, auth, checkIfUser, buySinglePost);

module.exports = router;