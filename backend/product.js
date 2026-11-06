const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  brand: String,
  price: {
    type: Number,
    required: true,
  },
  badge: String,
  category: String,
  image: String,
  stock: {
    type: Number,
    default: 10,
    min: 0,
  },
});

module.exports = mongoose.model("Product", productSchema);