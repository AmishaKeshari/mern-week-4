// models/Product.js - product catalog schema (marketplace style)
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },
    brand: { type: String, default: "Generic", trim: true },
    description: { type: String, default: "", trim: true },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },
    // original (pre-discount) price -> shows strike-through + % off
    originalPrice: { type: Number, default: 0, min: 0 },
    image: { type: String, default: "" },
    category: { type: String, default: "General", trim: true },
    countInStock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
