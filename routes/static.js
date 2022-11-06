const express = require('express');
const router = express.Router();

router.get('/about',(req,res)=>{
  res.render('about',{persist:req.persist});
})
router.get('/contact',(req,res)=>{
  res.render('contact',{persist:req.persist});
})

router.get('/checkout', (req, res) => {
  res.render('checkout', {
    persist: req.persist,
  });
});
module.exports = router;