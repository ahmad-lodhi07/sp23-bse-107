const express = require("express");
var expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose"); 

let server = express();


let Product = require("./models/product.model");
let User = require("./models/user.model");
let cookieParser = require("cookie-parser");
server.use(cookieParser());

let session = require("express-session");
server.use(session({ secret: "my session secret" }));

let siteMiddleware = require("./middlewares/site-middleware");
let authMiddleware = require("./middlewares/auth-middleware");
server.use(siteMiddleware);

server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));
server.use(express.static('./labTask-3/public'));
server.use(express.urlencoded({ extended: true })); 


const adminProductsRouter = require('./routes/admin/products.controller');


server.use('/admin', adminProductsRouter);

server.get("/about-me",authMiddleware, (req, res) => {
  return res.render("about-me");
});

// log out request

server.get("/logout", async (req, res) => {
  req.session.user = null;
  return res.redirect("/login");
});

// log in get request

server.get("/login", async (req, res) => {
  return res.render("auth/login");
});

// log in post request

server.post("/login", async (req, res) => {
  let data = req.body;
  let user = await User.findOne({ email: data.email });
  if (!user) return res.redirect("/register");
  isValid = user.password == data.password;
  if (!isValid) return res.redirect("/login");
  req.session.user = user;
  return res.redirect("/");
});

// register get request

server.get("/register", async (req, res) => {
  return res.render("auth/register");
});

// register post request

server.post("/register", async (req, res) => {
  let data = req.body;
  let user = await User.findOne({ email: data.email });
  if (user) return res.redirect("/register");
  user = new User(data);
  await user.save();
  return res.redirect("/login");
});

// cart get request

server.get("/cart",authMiddleware, async (req, res) => {
  let cart = req.cookies.cart;
  cart = cart ? cart : [];
  let products = await Product.find({ _id: { $in: cart } });
  return res.render("cart", { products });
});

server.get("/add-to-cart/:id", (req, res) => {
  let cart = req.cookies.cart;
  cart = cart ? cart : [];
  cart.push(req.params.id);
  res.cookie("cart", cart);
  return res.redirect("/");
});


server.get("/", (req, res) => {
  let user=req.session.user;
  return res.render("homepage",{user});
});

let adminMiddleware = require("./middlewares/admin-middleware");
server.use("/", authMiddleware, adminMiddleware, adminProductsRouter);

const dbURI = 'mongodb://localhost:27017/sp23-bse-b-107'; // Replace with your database name
mongoose
  .connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

server.get('/form', (req, res) => {
  res.render('form'); 
});

server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});
