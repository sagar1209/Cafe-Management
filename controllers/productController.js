const Category = require("../models/category");
const Product = require("../models/product");
const { Sequelize, where } = require("sequelize");

const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json({ message: "product added successfully", product });
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      return res.status(400).json({ error: "Validation error" });
    }
    res.status(500).json({ error: "internal server error" });
  }
};

const allProduct = async (req, res) => {
  try {
    const { category } = req.query;
    console.log(category);

    let include = [
      {
        model: Category,
        as: "category",
        attributes: ["category"],
      },
    ];
    if (category) {
      include[0].where = {
        category,
      };
    }
    let products = await Product.findAll({include});
    console.log(products);
    products = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        status: product.status,
        price: product.price,
        categoryId: product.categoryId,
        categoryName: product.category.category,
      };
    });
    res.status(200).json(products);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: "Internal server error" });
  }
};

const productById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      where: {
        id,
      },
    });
    if (!product) {
      return res.status(400).json({
        error: "product does not exist",
      });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedRowsCount] = await Product.update(req.body, {
      where: { id },
    });
    if (updatedRowsCount === 0) {
      return res
        .status(404)
        .json({ error: "product not found or no change made" });
    }

    res.status(200).json({ message: "product update successfully" });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRowsCount = await Product.destroy({
      where: { id },
    });
    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: "product not found" });
    }
    res.status(200).json({ message: "product delete successfully" });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

const activeOrUnactive = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id } });

    if (!product) {
      return res.status(400).json({ error: "product does not exist" });
    }

    await Product.update({ status: !product.status }, { where: { id } });
    // Fetch the updated user
    const updatedProduct = await Product.findOne({ where: { id } });

    let message;
    if (updatedProduct.status) {
      message = "Product activated successfully";
    } else {
      message = "Product deactivated successfully";
    }

    res.status(200).json({ message });
  } catch (error) {
    console.error("Error in activeOrUnactive:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addProduct,
  allProduct,
  productById,
  updateProduct,
  deleteProduct,
  activeOrUnactive,
};
