const express = require('express');
const app = express.Router();
const Razorpay = require('razorpay');
const PaymentDetail = require('../model/payment')

app.post('/', async (req, res) => {
   try{
    let {amount} = req.body;
    console.log('payment');
    var instance = new Razorpay({
        key_id: "rzp_test_p4B7WH2gc3wU12",
        key_secret: "bvCQXenWJVnTzKwKCkJLyjBt"
    });

    let order = await instance.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: "receipt#1",
    });
    
    res.status(201).json({
        success: true,
        order,
        amount,
    });
   }
   catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating user' });
  }
});

module.exports = app;