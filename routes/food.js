const express = require('express');
const { getFood } = require('../controllers/food');
const auth = require('../middleware/auth');
const { checkIfUser } = require('../middleware/requiredUser');
const router = express.Router();

router.get('/food/:id', auth, checkIfUser, getFood)

module.exports = router;