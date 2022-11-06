const express = require('express');
const { getMyOrders } = require('../controllers/order');
const router = express.Router();
const auth = require('../middleware/auth');
const { checkIfUser } = require('../middleware/requiredUser');

router.get('/myorders', auth, checkIfUser, getMyOrders)

module.exports = router;