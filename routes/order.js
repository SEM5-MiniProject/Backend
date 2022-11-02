const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { checkIfUser } = require('../middleware/requiredUser');
const Order = require('../model/order');
router.get('/myorders', auth, checkIfUser,async (req, res) => {
  const ordersandfood = await Order.aggregate([
    {
      $match: {
        $and: [
          { userId: req.user._id },
          { orderStatus: { $ne: 'cancelled' } }
        ]
      }
    },
    {
      $unwind: '$orderDetails'
    },
    {
      $lookup: {
        from: 'foods',
        localField: 'orderDetails.foodId',
        foreignField: '_id',
        as: 'orderDetails.food'
      }
    },

  ]);
  res.render('myorders', {
    persist: req.persist,
    orders:ordersandfood
  });
})

module.exports = router;