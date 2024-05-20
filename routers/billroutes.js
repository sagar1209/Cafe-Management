const express = require('express');
const {generateBill,getPdf,allBills,deletebill} = require('../controllers/billController')
const {verifyToken} = require('../config/auth')
const {checkAdmin} = require('../config/checkRole')
const router = express();

router.post('/generatereport',verifyToken,generateBill);
router.post('/getPdf/:uuid',verifyToken,getPdf);
router.get('/allbills',verifyToken,allBills);
router.delete('/deletebill/:id',verifyToken,deletebill);

module.exports= router;