const express = require('express');
const {addCategory,allCategory,categoryById,updateCategory} = require('../controllers/categoryController')
const {verifyToken} = require('../config/auth')
const {checkAdmin} = require('../config/checkRole')
const router = express();

router.post('/add',verifyToken,checkAdmin,addCategory);

router.get('/allcategory',verifyToken,allCategory);

router.get('/:id',verifyToken,categoryById);

router.patch('/update/:id',verifyToken,checkAdmin,updateCategory);

module.exports = router;

