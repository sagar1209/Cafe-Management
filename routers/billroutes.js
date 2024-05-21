const express = require('express');
const {generateBill,getPdf,allBills,deletebill} = require('../controllers/billController')
const {verifyToken} = require('../config/auth')
const {checkAdmin} = require('../config/checkRole')
const router = express();

router.post('/generatereport',verifyToken,generateBill);
router.post('/getPdf/:uuid',verifyToken,checkAdmin,getPdf);
router.get('/allbills',verifyToken,checkAdmin,allBills);
router.delete('/deletebill/:id',verifyToken,checkAdmin,deletebill);

module.exports= router;