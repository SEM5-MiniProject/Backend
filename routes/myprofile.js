const auth = require('../middleware/auth');
const express = require('express');
const { getMyProfile, postMyProfile, getById } = require('../controllers/myprofile');
const router = express.Router();

router.get('/myprofile', auth, getMyProfile)
router.post('/myprofile', auth, postMyProfile)
router.get('/myprofile/:id', getById)

module.exports = router;