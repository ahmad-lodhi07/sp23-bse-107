const express = require("express");
var expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose"); 

let server = express();
server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));
server.use(express.static('./labTask-3/public'));
server.use(express.urlencoded({ extended: true })); 


const adminProductsRouter = require('./routes/admin/products.controller');


server.use('/admin', adminProductsRouter);

const dbURI = 'mongodb://localhost:27017/myDatabase'; // Replace with your database name
mongoose
  .connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

server.get("/about-me", (req, res) => {
  return res.render("about-me");
});

server.get("/", (req, res) => {
  return res.render("homepage");
});

server.get('/form', (req, res) => {
  res.render('form'); 
});

server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});
