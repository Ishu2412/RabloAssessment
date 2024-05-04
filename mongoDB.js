import mongoose from "mongoose";

const rabloAuthSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const productSchema = new mongoose.Schema({
  email: String,
  productID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  company: {
    type: String,
    required: true,
  },
});

const RabloAuth = mongoose.model("RabloAuth", rabloAuthSchema);
const Product = mongoose.model("Product", productSchema);

export { RabloAuth, Product };
