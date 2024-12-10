const mongoose = require("mongoose");

let productSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true},
  price: { type: Number, required: true },
});

let ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
