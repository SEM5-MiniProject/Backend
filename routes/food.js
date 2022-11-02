const express = require('express');
const { default: mongoose } = require('mongoose');
const auth = require('../middleware/auth');
const { checkIfUser } = require('../middleware/requiredUser');
const router = express.Router();
const Food = require('../model/food')
router.get('/food/:id', auth,checkIfUser,async (req, res) => {
  console.log("food get");
  const { id } = req.params;
  const foodwithandwithoutoffer = await Food.aggregate([
    {
      $match: {
        isAvailable: true,
        _id: mongoose.Types.ObjectId(id)
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
        from:'carts',
        localField:'_id',
        foreignField:'food',
        as:'cart'
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
        category: 1,
        seller: { $arrayElemAt: ['$sellers', 0] },
        offer: {
          $filter: {
            input: '$offer',
            as: 'offer',
            cond: {
              $gte: ['$$offer.validTill', new Date()]
            }
          }
        },
        cart:{
          $filter:{
            input:'$cart',
            as:'cart',
            cond:{
              $eq:['$$cart.user',mongoose.Types.ObjectId(req.user._id)]
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
        category: 1,
        offer: {
          $arrayElemAt: ['$offer', 0]
        },
        cart:{
          $arrayElemAt:['$cart',0]
        }
      }
    }
  ]);
  
  if (foodwithandwithoutoffer.length == 0) {
    req.flash('error', 'Cannot find that food!');
    return res.redirect('/dashboard');
  }
  console.log(foodwithandwithoutoffer);
  res.render('showfood', {
    food:foodwithandwithoutoffer[0],
    persist: req.persist,
  });
})
module.exports = router;