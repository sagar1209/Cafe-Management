const express = require("express");
const sequelize = require("./config/connect");
const userrouter = require("./routers/userroutes");
const categoryrouter = require("./routers/categoryroutes");
const productrouter= require('./routers/productroutes')
const billrouter = require('./routers/billroutes');
const dashboardrouter = require('./routers/dashboardroutes')

const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use("/user", userrouter);
app.use("/category",categoryrouter);
app.use("/product",productrouter)
app.use("/bill",billrouter);
app.use("/dashboard",dashboardrouter);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(PORT, () => {
  console.log("server is running on " + PORT);
});
