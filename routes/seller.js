const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/seller');
const auth = require('../middleware/auth');
const { checkIfUser, checkIfSeller } = require('../middleware/requiredUser');
const validateRequest = require('../middleware/validateSchema');
const { addFoodSchema } = require('../schema/food.schema');
const upload = require('../utils/multer.util');
/**
 * @swagger
 * /seller/api/food/add:
 *   post:
 *     description: Add a new food item
 *     parameters:
 *      - name: name
 *        description: name of the food item
 *        required: true
 *        in: formData
 *        type: string
 *      - name: price
 *        description: price of the food item
 *        required: true
 *        in: formData
 *        type: number
 *      - name: description
 *        description: description of the food item
 *        required: true
 *        in: formData
 *        type: string
 *      - name: image
 *        description: image of the food item
 *        required: true
 *        in: formData
 *        type: file
 *      - name: category
 *        description: category of the food item
 *        required: true
 *        in: formData
 *        type: string
 *      - name: isVeg
 *        description: isVeg of the food item
 *        required: true
 *        in: formData
 *        type: boolean
 *      - name: isAvailable
 *        description: isAvailable of the food item
 *        required: true
 *        in: formData
 *        type: boolean
 *      - name: token
 *        description: token of the user
 *        in: cookie
 *        type: string
 *     responses:
 *       201:
 *         description: Food added successfully
 *       400:
 *         description: Food not added
 *       500:
 *         description: Internal Server Error
*/
router.post('/api/food/add', upload.single('image'), validateRequest(addFoodSchema), auth, checkIfSeller, sellerController.addFood);

/**
 * @swagger
 * /seller/api/food:
 *   get:
 *     description: Get all food items
 *     parameters:
 *      - name: token
 *        description: token of the user
 *        in: cookie
 *        type: string
 *     responses:
 *       200:
 *         description: Food items fetched successfully
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: Food items not found
 */
router.get('/api/food', auth, checkIfSeller, sellerController.getFoods);
module.exports = router;