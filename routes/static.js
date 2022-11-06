const express = require('express');
const Food = require('../model/food');
const {checkauth} = require('../middleware/checkauth');
const router = express.Router();

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
module.exports = router;