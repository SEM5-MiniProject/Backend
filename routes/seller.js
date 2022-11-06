const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/seller');
const auth = require('../middleware/auth');
const { checkIfSeller } = require('../middleware/requiredUser');
const upload = require('../utils/multer.util');
const checkMongoseId = require('../middleware/mongooseId');
const { checknotauth } = require('../middleware/checkauth');

router.get('/dashboard', checknotauth, sellerController.getDashbord);
router.get('/myproducts', auth, checkIfSeller, sellerController.getMyProducts);
router.get('/addproduct', auth, checkIfSeller, sellerController.getAddProduct);
router.post('/addproduct', upload.single('image'), auth, checkIfSeller, sellerController.postAddProduct);
router.post('/editproduct/:id', upload.single('image'), auth, checkIfSeller, checkMongoseId, sellerController.postEditProduct);
router.post('/addoffer/:id', auth, checkIfSeller, checkMongoseId, sellerController.postAddOffer);
router.post('/editoffer/:id', auth, checkIfSeller, checkMongoseId, sellerController.postEditOffer);
router.get('/deleteoffer/:id', auth, checkIfSeller, checkMongoseId, sellerController.getDeleteOffer);

module.exports = router;