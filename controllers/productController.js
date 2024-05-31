const Category = require("../models/category");
const Product = require("../models/product");
const { Sequelize, where } = require("sequelize");

const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json({ message: "Product Added Successfully", product });
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      return res.status(400).json({ error: "Validation Error" });
    }
    res.status(500).json({ error: "Internal Server Error" });
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
    res.status(500).json({ error: "Internal Server Error" });
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
        error: "Product does not exist !",
      });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
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
        .json({ error: "Product not found or No Changes were made !" });
    }

    res.status(200).json({ message: "Product Updated Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRowsCount = await Product.destroy({
      where: { id },
    });
    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: "Product not found !" });
    }
    res.status(200).json({ message: "Product Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const activeOrUnactive = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id } });

    if (!product) {
      return res.status(400).json({ error: "Product does not exist !" });
    }

    await Product.update({ status: !product.status }, { where: { id } });
    // Fetch the updated user
    const updatedProduct = await Product.findOne({ where: { id } });

    let message;
    if (updatedProduct.status) {
      message = "Product Activated Successfully";
    } else {
      message = "Product Deactivated Successfully";
    }

    res.status(200).json({ message });
  } catch (error) {
    console.error("Error in changing status !", error);
    res.status(500).json({ error: "Internal Server Error" });
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
