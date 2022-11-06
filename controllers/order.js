const Order = require("../model/order");

const getMyOrders = async (req, res) => {
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
};

module.exports = {
  getMyOrders
};  