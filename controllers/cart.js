const Cart = require('../model/cart');
const { default: mongoose } = require('mongoose');
const Food = require('../model/food');
const getCart = async (req, res) => {
  // showing the cart items and total price and offer price and total offer price and total items
  const myCart = await Cart.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup: {
        from: 'foods',
        localField: 'food',
        foreignField: '_id',
        as: 'food'
      }
    },
    {
      $lookup: {
        from: 'offers',
        localField: 'food._id',
        foreignField: 'food',
        as: 'offer'
      }
    },
    {
      $project: {
        food: { $arrayElemAt: ['$food', 0] },
        quantity: 1,
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
        food: 1,
        quantity: 1,
        offer: {
          $arrayElemAt: ['$offer', 0]
        }
      }
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: {
            $multiply: ['$food.price', '$quantity']
          }
        },
        totalOffer: {
          $sum: {
            $cond: {
              if: {
                $gte: ['$offer.validTill', new Date()]
              },
              then: {
                $multiply: [
                  {
                    $subtract: ['$food.price', '$offer.newprice']
                  },
                  '$quantity'
                ]
              },
              else: 0
            }
          },
        },
        totalItems: {
          $sum: '$quantity'
        },
        cart: {
          $push: {
            food: '$food',
            quantity: '$quantity',
            offer: '$offer'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        total: 1,
        totalOffer: 1,
        totalItems: 1,
        cart: 1
      }
    },
  ]);
  if (myCart.length === 0) {
    return res.render('cart', {
      persist: req.persist,
      cart: false,
    });
  }
  res.render('cart', {
    persist: req.persist,
    cart:{...myCart[0],items:myCart[0].cart}
  });
}
const addCartPost = async (req, res) => {
  const { id } = req.params;
  const food = await Food.findById(id);
  if (!food) {
    req.flash('error', 'Cannot find that food!');
    return res.redirect('/food');
  }
  // if food already exists in cart then increase quantity
  const cart = await Cart.findOne({
    $and: [
      { user: req.user._id },
      { food: food._id },
    ]
  });
  if (cart) {
    cart.quantity = req.body.quantity;
    await cart.save();
    req.flash('success', 'Food quantity updated successfully');
    return res.redirect('/cart');
  }
  else {
    const cart = new Cart({
      food: food._id,
      user: req.user._id,
      quantity: req.body.quantity ? req.body.quantity : 1,
    });
    await cart.save();
  }
  req.flash('success', 'Successfully added to cart');
  res.redirect('/cart');
}
const removeCartPost = async (req, res) => {
  const { id } = req.params;
  const food = await Food.findById(id);
  if (!food) {
    req.flash('error', 'Cannot find that food!');
    return res.redirect('/food');
  }
  await Cart.findOneAndDelete({
    $and: [
      { user: req.user._id },
      { food: food._id },
    ]
  });
  req.flash('success', 'Successfully removed from cart');
  res.redirect('/cart');
}
module.exports = {
  getCart,
  addCartPost,
  removeCartPost
};