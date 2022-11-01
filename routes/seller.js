const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/seller');
const auth = require('../middleware/auth');
const {checkIfSeller} = require('../middleware/requiredUser');
router.get('/dashboard',sellerController.getDashbord);
router.get('/myproducts',auth,checkIfSeller,sellerController.getMyProducts);
router.get('/addproduct',auth,checkIfSeller,sellerController.getAddProduct);
module.exports = router;