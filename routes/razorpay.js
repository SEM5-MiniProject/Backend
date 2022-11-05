const express = require('express');
const app = express.Router();
const Razorpay = require('razorpay');
const PaymentDetail = require('../model/payment');
const crypto = require('crypto');

app.post('/', async (req, res) => {
   try{
    let {amount} = req.body;
    console.log('payment');
    var instance = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET,
    });

    await instance.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: "receipt#1",
    }).then(async (response) => {
        // Save orderId and other payment details
        const paymentDetail = new PaymentDetail({
            orderId: response.id,
            receiptId: response.receipt,
            amount: response.amount,
            currency: response.currency,
            createdAt: response.created_at,
            status: response.status
        })

        try {
            // Render Order Confirmation page if saved succesfully
            await paymentDetail.save()
            res.status(201).json({
                success: true,
                order:response,
                amount,
            });
        
        } catch (err) {
            // Throw err if failed to save
            if (err) throw err;
        }
    });
   }
   catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating user' });
  }
});

app.post('/verify', (req, res) => {
    try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			req.body;
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.KEY_SECRET)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {
			return res.status(200).json({ message: "Payment verified successfully" });
		} else {
			return res.status(400).json({ message: "Invalid signature sent!" });
		}
	} catch (err) {
        console.log(err);
		res.status(500).json({ message: "Internal Server Error!" });

	}
})

module.exports = app;