const express = require('express');
const {register,login,forgotpassword,reset_password,changePassword,allUser,activeOrUnactive,logOut} = require('../controllers/userController')
const {verifyToken} = require('../config/auth')
const {checkAdmin} = require('../config/checkRole')
const router = express();

router.post('/register',register);

router.post('/login',login);

router.post('/forgotpassword',forgotpassword);

router.patch('/reset-password/',(req,res,next)=> verifyToken(req,res,next,process.env.FORGOT_KEY),reset_password)

router.patch('/change-password',verifyToken,changePassword);

router.get('/alluser',verifyToken,checkAdmin,allUser);

router.patch('/verify/:id',verifyToken,checkAdmin,activeOrUnactive);

router.post('/logout',logOut);

module.exports = router;