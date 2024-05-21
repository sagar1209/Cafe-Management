const express =  require('express');
const {dashboardDetails} = require('../controllers/dashboardController');
const {verifyToken} = require('../config/auth');

const router = express();

router.get('/details',verifyToken,dashboardDetails);

module.exports = router;