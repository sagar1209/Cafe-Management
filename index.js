const express = require("express");
const sequelize = require('./config/connect'); 
const authrouter = require('./routers/userroutes');

const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3001;

app.use(express.json())
app.use('/user',authrouter);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(PORT, () => {
  console.log("server is running on " + PORT);
});
