const { checkauth } = require('../middleware/checkauth');
const express = require('express');
const { getHome } = require('../controllers/home');
const router = express.Router();

router.get('/', checkauth, getHome);

module.exports = router;