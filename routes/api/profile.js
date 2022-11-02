const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/api/profile');
const checkMongoId = require('../../middleware/mongooseId');
const {checkIfSeller,checkIfUser} = require('../../middleware/api/requiredUser');
const auth = require('../../middleware/api/auth');
const validateSchema = require('../../middleware/validateSchema');
const { sellerProfileUpdateSchema } = require('../../schema/profile.schema');
/**
 * @swagger
 * /profile/seller/{id}:
 *   get:
 *     description: Use to request seller profile
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *     responses:
 *      200:
 *        description: A successful response
 *      400:
 *        description: Bad request
 */
router.get('/seller/:id', checkMongoId,profileController.getSellerProfile);

/**
 * @swagger
 * /profile/user/{id}:
 *   get:
 *     description: Use to request user profile
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *     responses:
 *      200:
 *        description: A successful response
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 */
router.get('/user/:id', checkMongoId,auth,checkIfSeller,profileController.getUserProfile);

/**
 * @swagger
 * /profile/user:
 *   get:
 *     description: Use to request user profile
 *     parameters:
 *      - name: token
 *        description: token of the user
 *        in: cookie
 *        type: string
 *     responses:
 *      200:
 *        description: A successful response
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not found
 */
router.get('/user', auth, checkIfUser, profileController.getUserMyProfile);

/**
 * @swagger
 * /profile/seller:
 *   get:
 *     description: Use to request seller profile
 *     parameters:
 *      - name: token
 *        description: token of the seller
 *        in: cookie
 *        type: string
 *     responses:
 *      200:
 *        description: A successful response
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not found
 */
router.get('/seller', auth, checkIfSeller, profileController.getSellerMyProfile);

/**
 * @swagger
 * /profile/seller:
 *   put:
 *     description: Use to update seller profile
 *     parameters:
 *      - name: token
 *        description: token of the seller
 *        in: cookie
 *        type: string
 *      - name: name
 *        description: name of the user
 *        required: true
 *        in: formData
 *        type: string
 *      - name: phoneNo
 *        description: phoneNo of the user
 *        in: formData
 *        required: true
 *        type: string
 *      - name: houseNo
 *        description: houseNo of the user
 *        in: formData
 *        required: true
 *        type: string
 *      - name: sector
 *        description: sector of the user
 *        in: formData
 *        required: true
 *        type: string
 *      - name: city
 *        description: city of the user
 *        in: formData
 *        required: true
 *        type: string
 *      - name: state
 *        description: state of the user
 *        in: formData
 *        required: true
 *        type: string
 *      - name: pincode
 *        description: pincode of the user
 *        in: formData
 *        required: true
 *        type: string
 *     responses:
 *      200:
 *        description: A successful response
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not found
 *      500:
 *        description: Internal server error
 */
router.put('/seller', auth, checkIfSeller, validateSchema(sellerProfileUpdateSchema),profileController.updateSellerProfile);

/**
 * @swagger
 * /profile/user:
 *   put:
 *     description: Use to update user profile
 *     parameters:
 *      - name: token
 *        description: token of the user
 *        in: cookie
 *        type: string
 *      - name: name
 *        description: name of the user
 *        required: true
 *        in: formData
 *        type: string
 *      - name: phoneNo
 *        description: phoneNo of the user
 *        in: formData
 *        required: true
 *        type: string
 *      - name: houseNo
 *        description: houseNo of the user
 *        in: formData
 *        required: true
 *        type: string
 *      - name: sector
 *        description: sector of the user
 *        in: formData
 *        required: true
 *        type: string
 *      - name: city
 *        description: city of the user
 *        in: formData
 *        required: true
 *        type: string
 *      - name: state
 *        description: state of the user
 *        in: formData
 *        required: true
 *        type: string
 *      - name: pincode
 *        description: pincode of the user
 *        in: formData
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: A successful response
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.put('/user', auth, checkIfUser, validateSchema(sellerProfileUpdateSchema),profileController.updateUserProfile);
module.exports = router;