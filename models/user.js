const sequelize = require('../config/connect'); 
const {Sequelize} = require('sequelize');

const User = sequelize.define('User',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    email : {
        type:Sequelize.STRING,
        allowNull: false,
        unique: true,
        
    },
    contactNumber:{
        type:Sequelize.STRING,
    },
    password:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, 
        allowNull: false,
    },
    role:{
        type:Sequelize.STRING,
        defaultValue:'user',
        allowNull: false,
    }
})

// Call sequelize.sync() to create tables based on models
sequelize.sync({ force: false}) 
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

module.exports = User;