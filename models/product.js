const sequelize = require("../config/connect");
const { Sequelize } = require("sequelize");
const Category = require('./category');

const Product = sequelize.define("Product", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING, // Corrected the type
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  categoryId: { 
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id',
  },
  },
});
// Call sequelize.sync() to create tables based on models
Product.sync({ force: false })
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });

Product.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' });


module.exports = Product;
