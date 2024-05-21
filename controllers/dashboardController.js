const Bill = require('../models/bill');
const Category = require('../models/category');
const Product = require('../models/product');


const dashboardDetails = async(req,res)=>{
    try {
        const productCount = await Product.count();
        const categoryCount = await Category.count();
        const billCount = await Bill.count();
    
        res.status(200).json({
            productCount,
            categoryCount,
            billCount
        })
    } catch (error) {
        res.status(500).json({message:"internal server error"})
    }
}



module.exports = {
    dashboardDetails
}