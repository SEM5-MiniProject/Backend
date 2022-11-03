const express = require('express');
const auth = require('../middleware/auth');
const Seller = require('../model/seller');
const User = require('../model/user');
const Food = require('../model/food');
const {checkauth} = require('../middleware/checkauth');
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
router.get('/', checkauth,async (req, res) => {
  const foodwithandwithoutoffer = await Food.aggregate([
    {
      $match: {
        isAvailable: true
      }
    },
    {
      $lookup: {
        from: 'offers',
        localField: '_id',
        foreignField: 'food',
        as: 'offer'
      }
    },
    {
      $lookup: {
        from: 'sellers',
        localField: 'belongsTo',
        foreignField: '_id',
        as: 'sellers'
      }
    },
    {
      $project: {
        name: 1,
        price: 1,
        image: 1,
        isVeg: 1,
        belongsTo: 1,
        seller: { $arrayElemAt: ['$sellers', 0] },
        offer: {
          $filter: {
            input: '$offer',
            as: 'offer',
            cond: {
              $gte: ['$$offer.validTill', new Date()]
            }
          }
        }
      }
    },
    {
      $project: {
        name: 1,
        price: 1,
        image: 1,
        isVeg: 1,
        seller: 1,
        belongsTo: 1,
        offer: {
          $arrayElemAt: ['$offer', 0]
        }
      }
    }
  ]);
  console.log(req.persist);
  res.render('index', {
    persist: req.persist,
    food: foodwithandwithoutoffer
  });
});
router.get('/checkout', (req, res) => {
  res.render('checkout', {
    persist: req.persist,
  });
});
router.get('/shop', (req, res) => {
  res.render('shop', { persist: req.persist })
})
module.exports = router;