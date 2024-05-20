const sequelize = require("../config/connect");
const { Sequelize } = require("sequelize");

const Bill = sequelize.define("Bill", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  uuid: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  contactNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  paymentMethod: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  total: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  productDetails: {
    type: Sequelize.JSON,
    defaultValue: null,
  },
  createdBy: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

Bill.sync({ force: false })
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });

module.exports = Bill;
