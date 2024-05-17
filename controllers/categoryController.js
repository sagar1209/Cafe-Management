const Category = require("../models/category");
const { Sequelize } = require("sequelize");

const addCategory = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({
        error: "caregory is required",
      });
    }
    let existingCategory  = await Category.findOne({
      where: {
        category: category,
      },
    });
    if (existingCategory ) {
      return res.status(400).json({ message: "category already exist" });
    }
    const newCategory = await Category.create({ category });
    res.status(200).json({ message: "category added successfully",newCategory });
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      return res.status(400).json({ error: "Validation error",});
  }
    res.status(500).json({ error: "internal server error" });
  }
};

const allCategory = async (req, res) => {
  try {
    const categories = await Category.findAll({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

const categoryById = async(req,res)=>{
    try {
        const {id} = req.params;
        const category = await Category.findOne({
            where:{
                id
            }
        })
        if(!category){
            return res.status(400).json({
                error: "category does not exist"
            })
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: "internal server error" });
    }
}

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ error: "category is required" });
    }
    const [updatedRowsCount] = await Category.update(
        { category },
        {
          where: { id },
        }
      );
      if (updatedRowsCount === 0) {
        return res.status(404).json({ error: "Category not found or no change made" });
      }

    res.status(200).json({message: "category update successfully"})
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
}
};



module.exports = {
    addCategory,
    allCategory,
    categoryById,
    updateCategory
}