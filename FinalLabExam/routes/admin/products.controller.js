const express = require("express");
let router = express.Router();
router.use(express.urlencoded({ extended: true }));

let Product = require("../../models/product.model");

// Route to handle delete of a product
router.get("/products/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.redirect("/admin/products");
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).send("Server Error");
  }
});

// Route to render edit product form
router.get("/products/edit/:id", async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    return res.render("admin/products/product-edit-form", {
      layout: "adminlayout",
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).send("Server Error");
  }
});

router.post("/products/edit/:id", async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    product.title = req.body.title;
    product.description = req.body.description;
    product.price = req.body.price;
    await product.save();
    return res.redirect("/admin/products");
  } catch (error) {
    console.error("Error editing product:", error);
    return res.status(500).send("Server Error");
  }
});

// Route to display all products from MongoDB
router.get("/products", async (req, res) => {
  try {
    let products = await Product.find(); 
    return res.render("admin/products", {
      layout: "adminlayout",
      pageTitle: "Manage Your Products",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).send("Server Error");
  }
});

// Route to render the create product form
router.get("/products/create", (req, res) => {
  res.render('admin/products/create');
});



// Route to display available products
router.get('/products', async (req, res) => {
  try {
    let products = await Product.find(); // Fetch products from the database
    return res.render('products', { products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).send('Server Error');
  }
});

// Route to add product to cart
router.get('/add-to-cart/:id', (req, res) => {
  let cart = req.cookies.cart || [];
  const productId = req.params.id;

  // Prevent duplicate product in the cart
  if (!cart.includes(productId)) {
    cart.push(productId);
  }

  // Save cart to cookies
  res.cookie('cart', cart);
  return res.redirect('/cart');
});

// Route to remove product from cart
router.get('/remove-from-cart/:id', (req, res) => {
  let cart = req.cookies.cart || [];
  const productId = req.params.id;

  // Remove product from cart
  cart = cart.filter(item => item !== productId);

  // Save updated cart to cookies
  res.cookie('cart', cart);
  return res.redirect('/cart');
});

// Route to checkout
router.get('/checkout', async (req, res) => {
  let cart = req.cookies.cart || [];
  let products = await Product.find({ _id: { $in: cart } });

  let totalAmount = products.reduce((sum, product) => sum + product.price, 0);

  res.render('checkout', { products, totalAmount });
});

// Route to handle form submission and save product to MongoDB
router.post("/products/create", async (req, res) => {
  try {
    
    console.log(req.body)
    let product = new Product(req.body);

    await product.save(); 
    return res.redirect("/admin/products");
  } catch (error) {
    console.error("Error saving product:");
    res.status(500).send("Server Error");
  }
});
module.exports = router;
