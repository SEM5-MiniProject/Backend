const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const PaymentDetail = require('../model/payment');
const crypto = require('crypto');
const Food = require('../model/food');
const auth = require('../middleware/auth');
const { checkIfUser } = require('../middleware/requiredUser');
const checkMongooseId = require('../middleware/mongooseId');
const { default: mongoose } = require('mongoose');
const { nanoid } = require('nanoid');
const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET
});
router.post('/verify', async (req, res) => {
  try {
    console.log("verify");
    console.log(req.body);
    const hmac = crypto.createHmac('sha256', process.env.KEY_SECRET);
    hmac.update(req.body.razorpay_order_id + '|' + req.body.razorpay_payment_id);
    const digest = hmac.digest('hex');
    if (digest === req.body.razorpay_signature) {
      const paymentData = await instance.payments.fetch(req.body.razorpay_payment_id);
      await PaymentDetail.findOneAndUpdate({ orderId: req.body.razorpay_order_id }, {
        paymentId: req.body.razorpay_payment_id,
        signature: req.body.razorpay_signature,
        status: 'paid',
        email: paymentData.email,
        contact: paymentData.contact
      }, { new: true });
      return res.status(200).json({
        message: 'Payment Successful'
      });
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
})
router.post('/:id', checkMongooseId, auth, checkIfUser, async (req, res) => {
  console.log(req.params.id);
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
      amount: actualPrice[0].price * 100,
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
      const paymentDetail = new PaymentDetail({
        userId: req.user._id,
        foodId: req.params.id,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receiptId: order.receipt,
        status: order.status
      });
      await paymentDetail.save();
      return res.status(200).json({ order, paymentDetail });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Something Went Wrong'
    });
  }
});

module.exports = router;