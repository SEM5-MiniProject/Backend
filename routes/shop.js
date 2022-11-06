const express = require('express');
const router = express.Router();
const { getShop } = require('../controllers/shop');
const auth = require('../middleware/auth');
const { checkIfUser } = require('../middleware/requiredUser');

router.get('/shop', auth, checkIfUser, getShop)

module.exports = router;