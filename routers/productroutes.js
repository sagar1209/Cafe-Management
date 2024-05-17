const express = require('express');
const {addProduct,allProduct,productById,updateProduct,deleteProduct,activeOrUnactive} = require('../controllers/productController')
const {verifyToken} = require('../config/auth')
const {checkAdmin} = require('../config/checkRole')
const router = express();

router.post('/add',addProduct);
router.get('/allproduct',allProduct);
router.get('/:id',productById);
router.patch('/update/:id',updateProduct);
router.delete('/delete/:id',deleteProduct);
router.patch('/verify/:id',activeOrUnactive);

module.exports = router;