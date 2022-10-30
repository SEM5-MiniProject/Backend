const express = require("express");
const cart_Route = express.Router();

const auth = require('../middleware/auth');

const cart_controller = require ("../controllers/cartController");
const { checkIfUser } = require("../middleware/requiredUser");

const validateSchema = require ('../middleware/validateSchema')
const cartSchema = require('../schema/cart.schema')
/**
 * @swagger
 * /add-to-cart/add:
 *   post:
 *     description: Add to Cart
 *     parameters:
 *      - name: food
 *        description: Food Id
 *        required: true
 *        in: formData
 *        type: string
 *      - name: token
 *        description: token of the user
 *        in: cookie
 *        type: string
 *      - name: quantity
 * 
 *        description: Number of food Items
 *        required: true
 *        in: formdata
 *        type: number
 *     responses:
 *       200:
 *         description: Items added successfully
 *       500:
 *         description: Error in adding the items

 */
 cart_Route.post('/add',auth, checkIfUser, validateSchema(cartSchema) ,cart_controller.add_to_cart );

/**
 * @swagger
 * /add-to-cart/{food}:
 *   get:
 *     description: get the items which is Added to Cart
 *     parameters:
 *      - name: food
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
 cart_Route.get('/add-to-cart/:food',auth, checkIfUser ,cart_controller.add_to_cart );

/**
 * @swagger
 * /add-to-cart/{food}:
 *   delete:
 *     description: get the items which is Added to Cart
 *     parameters:
 *      - name: food
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
 cart_Route.delete('/add-to-cart/:food',auth, checkIfUser ,cart_controller.add_to_cart );

 /**
 * @swagger
 * /add-to-cart/{food}:
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
  cart_Route.put('/add-to-cart/:food',auth, checkIfUser ,cart_controller.add_to_cart );

module.exports = cart_Route;
