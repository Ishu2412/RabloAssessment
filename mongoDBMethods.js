import mongoose from "mongoose";
import { Product, RabloAuth } from "./mongoDB.js";
import env from "dotenv";

env.config();

// const uri = process.env.URI;
const uri = `mongodb+srv://ishu:${process.env.URI_DATA}@cluster0.bbugwp2.mongodb.net/?retryWrites=true&w=majority`;

async function connect() {
  try {
    mongoose.connect(uri);
    console.log("Connected to Database");
  } catch (err) {
    console.error(`Error in connecting to Database${err}`);
  }
}

async function closeConnection() {
  try {
    mongoose.connection.close();
    console.log("Disconnected");
  } catch (err) {
    console.error(`Error while disconnecting ${err}`);
  }
}

async function addUser(data) {
  try {
    const newUser = new RabloAuth(data);
    await newUser.save();
  } catch (err) {
    console.log(`Error while adding new user #${err}`);
  }
}

async function getUser(email) {
  try {
    const data = await RabloAuth.findOne({ email: email });
    if (data) return data;
    else return false;
  } catch (err) {
    console.log(`Error while finding user ${err}`);
  }
}

async function addProduct(data) {
  try {
    const newProduct = new Product(data);
    await newProduct.save();
  } catch (err) {
    console.error(`Error while adding the product ${err}`);
  }
}

async function findProducts(email) {
  try {
    const products = await Product.find({ email: email });
    return products;
  } catch (err) {
    console.log(`Error in finding products ${err}`);
  }
}

async function updateProduct(productId, updateData) {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { productID: productId },
      updateData,
      { new: true }
    );
    return updateProduct;
  } catch (err) {
    console.log(`Error while updating product`);
  }
}

async function deleteProduct(productId) {
  try {
    await Product.findOneAndDelete({ productID: productId });
  } catch (err) {
    console.log(`Error while deleting product ${err}`);
  }
}

async function getFeaturedProducts() {
  try {
    const featuredProducts = await Product.find({ featured: true });
    return featuredProducts;
  } catch (err) {
    console.log(`Error while getting featured Products ${err}`);
  }
}

async function getPriceRangedProducts(price) {
  try {
    const products = await Product.find({ price: { $lt: price } });
    return products;
  } catch (err) {
    console.log(`Error while getting price ranged products ${err}`);
  }
}

async function getRatingRangedProducts(rating) {
  try {
    const products = await Product.find({ rating: { $gt: rating } });
    return products;
  } catch (err) {
    console.log(`Error while getting rating ranged products ${err}`);
  }
}

export {
  connect,
  closeConnection,
  addUser,
  addProduct,
  getUser,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getPriceRangedProducts,
  getRatingRangedProducts,
  findProducts,
};
