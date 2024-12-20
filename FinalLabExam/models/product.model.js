const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true }, // URL to the product image
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
