const express = require('express');
const auth = require('../middleware/auth');
const Seller = require('../model/seller');
const User = require('../model/user');
const router = express.Router();

router.get('/myprofile', auth, async (req, res) => {
  if (req.user && req.user.id) {
    const user = await User.findById(req.user.id);
    console.log(user);
    res.render('myprofile', { user: user, persist: req.persist });
  }
  if (req.seller && req.seller.id) {
    const seller = await Seller.findById(req.seller.id);
    res.render('myprofile', { user: seller, persist: req.persist });
  }
})
// update Profile
router.post('/myprofile',auth,async (req,res)=>{
  if (req.user && req.user.id) {
    const user = await User.findByIdAndUpdate(req.user.id,req.body,{new:true});
    console.log(user);
    return res.render('myprofile', { user: user, persist: req.persist });
  }
  if (req.seller && req.seller.id) {
    console.log("seller",req.seller.id,req.body);
    const seller = await Seller.findByIdAndUpdate(req.seller.id,req.body,{new:true});
    return res.render('myprofile', { user: seller, persist: req.persist });
  }
  res.redirect('/signin');
})
router.get('/myprofile/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  const seller = await Seller.findById(req.params.id);
  return res.render('myprofile', { user: user ? user : seller, persist: req.persist ,message:true});
})
router.get('/about',(req,res)=>{
  res.render('about',{persist:req.persist});
})

module.exports = router;