import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import env from "dotenv";
import {
  connect,
  closeConnection,
  addProduct,
  addUser,
  getUser,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getPriceRangedProducts,
  getRatingRangedProducts,
  findProducts,
} from "./mongoDBMethods.js";

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
env.config();

connect();

app.get("/", (req, res) => {
  res.status(200).json(`Product Ready`);
});

// adding new user
app.post("/register", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const check = await getUser(email);
    console.log(email);
    console.log(password);
    console.log(check);

    //if user already exists
    if (check) {
      console.log(check);
      res.status(409).send(`User already exists. Try loggin in.`);
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log(`Error while hashing the password ${err}`);
        } else {
          const user = {
            email: email,
            password: hash,
          };
          await addUser(user);
          res.status(200).send("registered");
        }
      });
    }
  } catch (err) {
    console.error(`Error while registering the user: ${err}`);
    res.status(500).send(`Internal server error`);
  }
});

//   login new user
app.post("/login", async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
    };
    const user = await getUser(data.email);
    if (user) {
      const storedHashedPassword = user.password;
      bcrypt.compare(data.password, storedHashedPassword, (err, result) => {
        if (err) {
          res.status(500).send(`Error while Authorizing`);
        } else {
          if (result) {
            res.status(200).send("logined");
          } else {
            res.status(401).send(`Password not match`);
          }
        }
      });
    } else {
      res.status(401).send(`User not found`);
    }
  } catch (err) {
    res.status(500).send(`Internal Server Error ${err}`);
  }
});

// adding new product
app.post("/add", async (req, res) => {
  try {
    const {
      email,
      productID,
      name,
      price,
      featured,
      rating,
      createdAt,
      company,
    } = req.body;

    const user = getUser(email);
    // Create a new product instance using the Product model
    if (!user) res.status(404).json(`User not found`);
    const data = {
      email,
      productID,
      name,
      price,
      featured,
      rating,
      createdAt,
      company,
    };
    await addProduct(data);
    res.status(200).json(`true`);
  } catch (err) {
    res.status(500).json(`Internal Server Error`);
  }
});

app.post("/getProducts", async (req, res) => {
  try {
    const products = await findProducts(req.body.email);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(`Internal Server Error ${err}`);
  }
});

app.put("/update/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const updateData = req.body;
    const updatedProduct = await updateProduct(productId, updateData);
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(`Error while updating product: ${err}`);
    res.status(500).json(`Internal Server Error`);
  }
});

app.delete("/delete/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    await deleteProduct();
    res.status(200).json(`Product deleted successfully`);
  } catch (err) {
    console.error(`Error while deleting product: ${err}`);
    res.status(500).json(`Internal Server Error`);
  }
});

app.get("/featured-products", async (req, res) => {
  try {
    const featuredProducts = await getFeaturedProducts();
    res.status(200).json(featuredProducts);
  } catch (err) {
    console.error(`Error while fetching featured products: ${err}`);
    res.status(500).json(`Internal Server Error`);
  }
});

app.get("/products-less-than", async (req, res) => {
  try {
    const price = parseFloat(req.body.price);
    const products = await getPriceRangedProducts(price);
    res.status(200).json(products);
  } catch (err) {
    console.error(
      `Error while fetching products less than a certain price: ${err}`
    );
    res.status(500).json(`Internal Server Error`);
  }
});

app.get("/products-rating-higher-than", async (req, res) => {
  try {
    const rating = parseFloat(req.body.rating);
    const products = await getRatingRangedProducts(rating);
    res.status(200).json(products);
  } catch (err) {
    console.error(
      `Error while fetching products with rating higher than a certain value: ${err}`
    );
    res.status(500).json(`Internal Server Error`);
  }
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

process.on("SIGINT", () => {
  closeConnection();
  process.exit();
});
