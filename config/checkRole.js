const checkAdmin = async(req,res,next)=>{
    try {
        if(req.local.role === 'admin'){
            return next();
        }
        return res.status(400).json({error : "you are a user; you can not access"});
    } catch (error) {
        return res.status(500).json({error:"internal server error"})
    }
}

module.exports = {
   checkAdmin
}