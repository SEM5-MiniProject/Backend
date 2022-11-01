const express = require('express');
const auth = require('../middleware/auth');
const {checkIfUser} =require('../middleware/requiredUser');
const router = express.Router();

router.get('/cart', auth,checkIfUser,(req, res) => {
  res.render('cart', {
    persist: req.persist,
  });
});
module.exports = router;