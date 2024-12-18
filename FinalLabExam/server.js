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
  console.log("Logging out : "+req.session.user);
  req.session.user = null;
  console.log("\n\nNow after intializing it with null : "+req.session.user);
  return res.redirect("/");
});

// log in get request

server.get("/login", async (req, res) => {
  return res.render("auth/login",{user:req.session.user});
});
A
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
const Order = require("./models/order.model"); // Import the Order model

server.post("/checkout", authMiddleware, async (req, res) => {
    try {
        const { name, street, city, postalCode } = req.body;

        // Get products from the cart
        let cart = req.cookies.cart || [];
        let products = await Product.find({ _id: { $in: cart } });

        // Calculate total amount
        const totalAmount = products.reduce((sum, product) => sum + product.price, 0);

        // Create a new order
        const newOrder = new Order({
            customerName: name,
            address: { street, city, postalCode },
            products: cart,
            totalAmount
        });

        await newOrder.save();

        // Clear the cart
        res.clearCookie("cart");

        res.send(`<h3>Order Placed Successfully!</h3><a href="/">Return to Home</a>`);
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).send("An error occurred while placing the order.");
    }
});

server.get("/admin/orders", authMiddleware, async (req, res) => {
  const orders = await Order.find().sort({ orderDate: -1 });
  const products = await Product.find(); // Fetch products for the top table
  res.render("admin/products", { products, orders });
});



server.get("/", (req, res) => {
  console.log(req.session.user);
  return res.render("homepage",{user : req.session.user});
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
