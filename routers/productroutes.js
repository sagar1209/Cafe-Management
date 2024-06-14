const express = require('express');
const {addProduct,allProduct,productById,updateProduct,deleteProduct,activeOrUnactive} = require('../controllers/productController')
const {verifyToken} = require('../config/auth')
const {checkAdmin} = require('../config/checkRole')
const router = express();

router.post('/add',verifyToken,checkAdmin,addProduct);
router.get('/allproduct',verifyToken,allProduct);
router.get('/:id',verifyToken,productById);
router.patch('/update/:id',verifyToken,checkAdmin,updateProduct);
router.delete('/delete/:id',verifyToken,checkAdmin,deleteProduct);
router.patch('/changeStatus/:id',verifyToken,checkAdmin,activeOrUnactive);

module.exports = router;