const sequelize = require('../config/connect'); 
const {Sequelize} = require('sequelize');

const Category = sequelize.define('Category',{
    id : {
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
    },
    category:{
        type: Sequelize.STRING,
        allowNull:false
    }
},{
    timestamps: false
})

// Call sequelize.sync() to create tables based on models
Category.sync({ force: false}) 
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });


module.exports = Category;
