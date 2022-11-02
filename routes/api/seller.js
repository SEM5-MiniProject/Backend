const express = require('express');
const router = express.Router();
const sellerController = require('../../controllers/api/seller');
const auth = require('../../middleware/api/auth');
const checkMongoId = require('../../middleware/mongooseId');
const { checkIfSeller } = require('../../middleware/api/requiredUser');
const validateRequest = require('../../middleware/validateSchema');
const { addFoodSchema } = require('../../schema/food.schema');
const { foodOfferSchema } = require('../../schema/offer.schema');
const upload = require('../../utils/multer.util');
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

/**
 * @swagger
 * /seller/api/food/offers:
 *   get:
 *     description: Get all offers
 *     parameters:
 *      - name: token
 *        description: token of the user
 *        in: cookie
 *        type: string
 *     responses:
 *       200:
 *         description: Offers fetched successfully
 *       500:
 *         description: Internal Server Error
 *       400:
 *         description: Offers not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
 router.get('/api/food/offers', auth, checkIfSeller, sellerController.getAllOffers);
 
/**
 * @swagger
 * /seller/api/food/{id}:
 *   get:
 *     description: Get a food item
 *     parameters:
 *      - name: id
 *        description: id of the food item
 *        required: true
 *        in: path
 *        type: string
 *      - name: token
 *        description: token of the user
 *        in: cookie
 *        type: string
 *     responses:
 *       200:
 *         description: Food item fetched successfully
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: Food item not found
 */
router.get('/api/food/:id', checkMongoId,auth, checkIfSeller, sellerController.getFood);

/**
 * @swagger
 * /seller/api/food/{id}:
 *   delete:
 *     description: Delete a food item
 *     parameters:
 *      - name: id
 *        description: id of the food item
 *        required: true
 *        in: path
 *        type: string
 *      - name: token
 *        description: token of the user
 *        in: cookie
 *        type: string
 *     responses:
 *       200:
 *         description: Food item deleted successfully
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: Food item not found
 */
router.delete('/api/food/:id', checkMongoId, auth, checkIfSeller, sellerController.deleteFood);

/**
 * @swagger
 * /seller/api/food/{id}:
 *   put:
 *     description: Update a food item
 *     parameters:
 *      - name: id
 *        description: id of the food item
 *        required: true
 *        in: path
 *        type: string
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
 *       200:
 *         description: Food item updated successfully
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: Food item not found
 *       400:
 *         description: Food item not updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/api/food/:id', checkMongoId, upload.single('image'), auth, checkIfSeller, sellerController.updateFood);

/**
 * @swagger
 * /seller/api/food/{id}/offer:
 *   post:
 *     description: Add offer to a food item
 *     parameters:
 *      - name: id
 *        description: id of the food item
 *        required: true
 *        in: path
 *        type: string
 *      - name: validTill
 *        description: validTill of the offer
 *        required: true
 *        in: formData
 *        type: string
 *      - name: discount
 *        description: discount of the offer
 *        required: true
 *        in: formData
 *        type: number
 *      - name: token
 *        description: token of the user
 *        in: cookie
 *        type: string
 *     responses:
 *       200:
 *         description: Offer added successfully
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: Food item not found
 *       400:
 *         description: Offer not added
 */
router.post('/api/food/:id/offer', checkMongoId, auth, checkIfSeller, validateRequest(foodOfferSchema),sellerController.addOffer);

/**
 * @swagger
 * /seller/api/food/{id}/offer:
 *   get:
 *     description: Get offer of a food item
 *     parameters:
 *      - name: id
 *        description: id of the food item
 *        required: true
 *        in: path
 *        type: string
 *      - name: token
 *        description: token of the user
 *        in: cookie
 *        type: string
 *     responses:
 *       200:
 *         description: Offer fetched successfully
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: Food item not found
 *       400:
 *         description: Offer not found
 */
router.get('/api/food/:id/offer', checkMongoId, auth, checkIfSeller, sellerController.getOffer); 

/**
 * @swagger
 * /seller/api/food/{id}/offer:
 *   put:
 *     description: Update offer of a food item
 *     parameters:
 *      - name: id
 *        description: id of the food item
 *        required: true
 *        in: path
 *        type: string
 *      - name: validTill
 *        description: validTill of the offer
 *        required: true
 *        in: formData
 *        type: string
 *      - name: discount
 *        description: discount of the offer
 *        required: true
 *        in: formData
 *        type: number
 *      - name: token
 *        description: token of the user
 *        in: cookie
 *        type: string
 *     responses:
 *       200:
 *         description: Offer updated successfully
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: Food item not found
 */
router.put('/api/food/:id/offer', checkMongoId, auth, checkIfSeller, validateRequest(foodOfferSchema),sellerController.updateOffer);

/**
 * @swagger
 * /seller/api/food/{id}/offer:
 *   delete:
 *     description: Delete offer of a food item
 *     parameters:
 *      - name: id
 *        description: id of the food item
 *        required: true
 *        in: path
 *        type: string
 *      - name: token
 *        description: token of the user
 *        in: cookie
 *        type: string
 *     responses:
 *       200:
 *         description: Offer deleted successfully
 *       500:
 *         description: Internal Server Error
 *       404:
 *         description: Food item not found
 *       400:
 *         description: Offer not deleted
 */
router.delete('/api/food/:id/offer', checkMongoId, auth, checkIfSeller, sellerController.deleteOffer);

module.exports = router;