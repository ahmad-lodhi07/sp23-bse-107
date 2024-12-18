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
let authMiddleware = require("./middlewares/auth-middleware");

// Middleware to set `user` globally for all views
server.use((req, res, next) => {
  res.locals.user = req.session.user || null; // `user` is available in all EJS files
  next();
});

server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));
server.use(express.static('./labTask-3/public'));
server.use(express.urlencoded({ extended: true }));

const adminProductsRouter = require('./routes/admin/products.controller');

server.use('/admin', adminProductsRouter);

server.get("/about-me", authMiddleware, (req, res) => {
  return res.render("about-me");
});

// Log out request
server.get("/logout", async (req, res) => {
  req.session.user = null;
  return res.redirect("/");
});

// Login routes
server.get("/login", async (req, res) => {
  return res.render("auth/login");
});

server.post("/login", async (req, res) => {
  let data = req.body;
  let user = await User.findOne({ email: data.email });
  if (!user) return res.redirect("/register");
  const isValid = user.password === data.password;
  if (!isValid) return res.redirect("/login");
  req.session.user = user;
  return res.redirect("/");
});

// Register routes
server.get("/register", async (req, res) => {
  return res.render("auth/register");
});

server.post("/register", async (req, res) => {
  let data = req.body;
  let user = await User.findOne({ email: data.email });
  if (user) return res.redirect("/register");
  user = new User(data);
  await user.save();
  return res.redirect("/login");
});

// Cart route
server.get("/cart", authMiddleware, async (req, res) => {
  let cart = req.cookies.cart || [];
  let products = await Product.find({ _id: { $in: cart } });
  return res.render("cart", { products });
});

// Other routes
server.get("/", (req, res) => {
  return res.render("homepage");
});

const dbURI = 'mongodb://localhost:27017/sp23-bse-b-107';
mongoose
  .connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});
