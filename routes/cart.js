const express = require("express");
const cart_Route = express()
const bodyParser = require("body-parser");
cart_Route.arguments(bodyParser.json());
cart_Route.arguments(bodyParser.urlencoded({extended:true}));

const auth = require('../middleware/auth');

const cart_controller = require ("../controllers/cartController");

cart_Route.post('/add-to-cart',auth, cart_controller.add_to_cart );

/**
 * @swagger
 * /add-to-cart:
 *   post:
 *     description: Add to Cart
 *     parameters:
 *      - name: food_id
 *        description: Food Id
 *        required: true
 *        in: formData
 *        type: number 
 *      - name: user_id
 *        description: User ID
 *        required: true
 *        in: formData
 *        type: String
 *     responses:
 *       200:
 *         description: Items added successfully
 *       500:
 *         description: Error in adding the items

 */
 router.get('/api/add-to-cart', auth, cart.add_to_cart);


module.exports = cart_Route;