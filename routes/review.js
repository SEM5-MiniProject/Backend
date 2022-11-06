const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { checkIfUser } = require('../middleware/requiredUser');
const checkMongoId = require('../middleware/mongooseId');
const { reviewAddPost, reviewDeletePost } = require('../controllers/review');

router.post('/review/add/:id', auth, checkIfUser, checkMongoId,reviewAddPost);
router.post('/review/delete/:id', auth, checkIfUser, checkMongoId,reviewDeletePost);

module.exports = router;