const express = require('express');
const router = express.Router();
const auth = require('../../controllers/api/auth');
const validateRequest = require('../../middleware/validateSchema');
const { userSignupSchema, userLoginSchema } = require('../../schema/user.schema');

/**
 * @swagger
 * /user/api/signup:
 *   post:
 *     description: Create a new User or Seller based on the isSeller value if true then create a seller else create a user
 *     parameters:
 *      - name: name
 *        description: name of the user
 *        required: true
 *        in: formData
 *        type: string
 *      - name: email
 *        description: email of the user
 *        required: true
 *        in: formData
 *        type: string
 *      - name: password
 *        description: password of the user
 *        in: formData
 *        required: true
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
 *      - name: isSeller
 *        description: isSeller of the user
 *        in: formData
 *        required: true
 *        type: boolean
 *     responses:
 *       201:
 *         description: Signup successfully
 *       400:
 *         description: user already exists
 *       500:
 *         description: Error creating user
 */
router.post('/api/signup', validateRequest(userSignupSchema), auth.userSignup);

/**
 * @swagger
 * /user/api/login:
 *   post:
 *     description: login a user or seller based on the isSeller value if true then login a seller else login a user
 *     parameters:
 *      - name: email
 *        description: email of the user
 *        required: true
 *        in: formData
 *        type: string
 *      - name: password
 *        description: password of the user
 *        in: formData
 *        required: true
 *        type: string
 *      - name: isSeller
 *        description: isSeller of the user
 *        in: formData
 *        required: true
 *        type: boolean
 *     responses:
 *       201:
 *         description: Signup successfully
 *       400:
 *         description: Invalid Credentials
 *       500:
 *         description: Error in login
 */
router.post('/api/login', validateRequest(userLoginSchema), auth.userLogin);

router.get('/api/logout', auth.userLogout);
module.exports = router;
