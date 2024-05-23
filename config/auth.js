
const jwt = require('jsonwebtoken');
require('dotenv').config({path : "../.env"});
const blacklist = new Set();


const generateToken = async (payload,secretKey,expiresIn = '10h') => {
    try {
        return jwt.sign(payload, secretKey,{ expiresIn });
    } catch (error) {
        return res.status(401).json({ error: 'Failed to generate token' });
    }
}

const verifyToken = async (req, res, next,secretKey=process.env.JWT) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authorization token is missing.' });
        }
        const decoded = jwt.verify(token, secretKey);
        req.local = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

const checkToken = async(req,res,secretKey=process.env.JWT)=>{
   try {
      const {token} = req.params;
      if(!token)  res.status(400).json({message : false})
      jwt.verify(token,secretKey);
      res.status(200).json({message : true});
   } catch (error) {
       res.status(400).json({message : false})
   }
}

const expireToken = async(req,res,next)=>{
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        blacklist.add(decoded.uniqueID);
        return next();
    } catch (error) {
        return res.status(500).json({ error: "internal server Error" });
    }
}

module.exports = {
    generateToken,
    verifyToken,
    expireToken,
    checkToken
};