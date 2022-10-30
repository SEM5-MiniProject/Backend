const express = require("express");
const cart_Route = express.cart();

const auth = require('../middleware/auth');

const cart_controller = require ("../controllers/cartController");
const { checkIfUser } = require("../middleware/requiredUser");



/**
 * @swagger
 * /add-to-cart/add:
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
 *        in: cookie
 *        type: String 
 *      - name: quantity
 *        description: Number of food Items
 *        required: true
 *        in: formdata
 *        type: String
 *     responses:
 *       200:
 *         description: Items added successfully
 *       500:
 *         description: Error in adding the items

 */
 cart_Route.post('/add-to-cart/add',auth, checkIfUser ,cart_controller.add_to_cart );

/**
 * @swagger
 * /add-to-cart/{food_id}:
 *   get:
 *     description: get the items which is Added to Cart
 *     parameters:
 *      - name: food_id
 *        description: get a Food Id
 *        required: true
 *        in: formData
 *        type: number 
 *      - name: quantity
 *        description: get the Number of food Items
 *        required: true
 *        in: formdata
 *        type: String 
 *      - name: token
 *        description: token of the user
 *        in: cookie
 *        type: string
 *     responses:
 *       200:
 *         description: Items fetched successfully
 *       500:
 *         description: food item not found

 */
 cart_Route.get('/add-to-cart/:food_id',auth, checkIfUser ,cart_controller.add_to_cart );


/**
 * @swagger
 * /add-to-cart/{food_id}:
 *   delete:
 *     description: get the items which is Added to Cart
 *     parameters:
 *      - name: food_id
 *        description: get a Food Id
 *        required: true
 *        in: formData
 *        type: number 
 *      - name: quantity
 *        description: get the Number of food Items
 *        required: true
 *        in: formdata
 *        type: String 
 *      - name: token
 *        description: token of the user
 *        in: cookie
 *        type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       500:
 *         description: food item not found

 */
 cart_Route.delete('/add-to-cart/:food_id',auth, checkIfUser ,cart_controller.add_to_cart );


 /**
 * @swagger
 * /add-to-cart/{food_id}:
 *   put:
 *     description: put the items in the Cart
 *     parameters:
 *      - name: food_id
 *        description: get a Food Id
 *        required: true
 *        in: formData
 *        type: number 
 *      - name: quantity
 *        description: put the quantity of food Items
 *        required: true
 *        in: formdata
 *        type: String 
 *      - name: token
 *        description: token of the user
 *        in: cookie
 *        type: string
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       500:
 *         description: food item not found

 */
  cart_Route.put('/add-to-cart/:food_id',auth, checkIfUser ,cart_controller.add_to_cart );


module.exports = cart_Route;
