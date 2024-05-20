const express = require('express');
const {addProduct,allProduct,productById,updateProduct,deleteProduct,activeOrUnactive} = require('../controllers/productController')
const {verifyToken} = require('../config/auth')
const {checkAdmin} = require('../config/checkRole')
const router = express();

router.post('/add',verifyToken,addProduct);
router.get('/allproduct',verifyToken,allProduct);
router.get('/:id',verifyToken,productById);
router.patch('/update/:id',verifyToken,updateProduct);
router.delete('/delete/:id',verifyToken,deleteProduct);
router.patch('/verify/:id',verifyToken,activeOrUnactive);

module.exports = router;