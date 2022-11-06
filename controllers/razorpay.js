const { default: mongoose } = require('mongoose');
const Cart = require('../model/cart');
const Order = require('../model/order');
const { nanoid } = require('nanoid');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Food = require('../model/food');
const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET
});

const verifyPost = async (req, res) => {
  try {
    console.log("verify");
    console.log(req.body);
    const hmac = crypto.createHmac('sha256', process.env.KEY_SECRET);
    hmac.update(req.body.razorpay_order_id + '|' + req.body.razorpay_payment_id);
    const digest = hmac.digest('hex');
    if (digest === req.body.razorpay_signature) {
      await Order.updateMany({ orderId: req.body.razorpay_order_id }, {
        paymentId: req.body.razorpay_payment_id,
        signature: req.body.razorpay_signature,
        paymentStatus: 'paid',
      }, { new: true });
      return res.redirect('/');
    } else {
      return res.status(500).json({
        message: 'Something Went Wrong'
      });
    }
  }
  catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Something Went Wrong'
    });
  }
}

const cartPost = async (req,res)=>{
  try{
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
    const order = await instance.orders.create({
      amount: (myCart[0].total - myCart[0].totalOffer) * 100,
      currency: 'INR',
      receipt: nanoid(),
      payment_capture: 1,
    });
    console.log(myCart[0].cart);
    const OrderDetail = myCart[0].cart.map((item) => {
      return {
        foodId: item.food._id,
        quantity: item.quantity,
        price: item.offer && item.offer.newprice ? item.offer.newprice : item.food.price,
      }
    });
    console.log(OrderDetail);
    const paymentCart = new Order({
      userId: req.user._id,
      orderDetails: OrderDetail,
      totalAmount:order.amount / 100,
      paymentType: 'online',
      orderId: order.id,
      status: order.status,
      receiptId: order.receipt,
    })
    await paymentCart.save();
    res.status(200).json({
      order: order,
      payment:paymentCart
    });
  }
  catch(e){
    console.log(e);
    res.status(500).json({
      message: 'Something Went Wrong'
    });
  }
}
const buySinglePost = async (req, res) => {
  console.log(req.body);
  try {
    // check if food is available and has any offer
    const actualPrice = await Food.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.id),
          isAvailable: true,
        },
      },
      {
        $lookup: {
          from: 'offers',
          localField: '_id',
          foreignField: 'food',
          as: 'offer',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          offer: {
            $filter: {
              input: '$offer',
              as: 'offer',
              cond: {
                $gte: ['$$offer.validTill', new Date()]
              }
            },
          }
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          offer: {
            $cond: {
              if: {
                $eq: [
                  {
                    $size: '$offer'
                  },
                  0
                ]
              },
              then: 0,
              else: {
                $arrayElemAt: ['$offer', 0]
              }
            }
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          offer: 1,
          actual: {
            $cond: {
              if: { $eq: ['$offer', 0] },
              then: '$price',
              else: '$offer.newprice',

            }
          }
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: '$actual',
        },
      }
    ])
    const options = {
      amount: req.body.quantity ? actualPrice[0].price * 100 * req.body.quantity : actualPrice[0].price * 100,
      currency: 'INR',
      receipt: nanoid(),
      payment_capture: 1
    };
    instance.orders.create(options, async (err, order) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Something Went Wrong'
        });
      }
      const paymentDetail = new Order({
        userId: req.user._id,
        orderDetails:[{
          foodId: req.params.id,
          quantity: req.body.quantity ? req.body.quantity : 1,
          price: actualPrice[0].price,
        }],
        totalAmount:order.amount / 100,
        paymentType: 'online',
        orderId: order.id,
        status: order.status,
        receiptId: order.receipt,
      })
      await paymentDetail.save();
      return res.status(200).json({ order, paymentDetail });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Something Went Wrong'
    });
  }
}
module.exports = {
  verifyPost,
  cartPost,
  buySinglePost,
}