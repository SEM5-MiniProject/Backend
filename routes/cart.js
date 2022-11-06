const express = require('express');
const auth = require('../middleware/auth');
const { checkIfUser } = require('../middleware/requiredUser');
const router = express.Router();
const checkMongoId = require('../middleware/mongooseId');
const { getCart, addCartPost, removeCartPost } = require('../controllers/cart');

router.get('/cart', auth, checkIfUser, getCart);
router.post('/cart/add/:id', auth, checkIfUser, checkMongoId, addCartPost);
router.post('/cart/remove/:id', auth, checkIfUser, checkMongoId, removeCartPost)

module.exports = router;