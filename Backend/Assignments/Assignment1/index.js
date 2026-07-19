import express from "express";
import mongoose from "mongoose";
import Data from "./data.js";
import Product from "./schema.js";

const app = express();

app.use(express.json());
await mongoose.connect(
  "mongodb+srv://sudheermishra8587_db_user:uLjCwNDEB1b4w5x8@cluster0.vh95za4.mongodb.net/AssignmentFirst",
);

// 1. Create product
// concepts :-
// create()
// schema validation
// required
// enum
// unique

//                                               Part 1: Basic CRUD

app.post("/products", async (req, resp) => {
  try {
    const body = req.body;
    const product = await Product.create(body);
    resp.status(201).json({
      message: "product created sucessfully",
      product,
    });
  } catch (error) {
    resp.status(400).json({
      message: error.message,
    });
  }
});

// 2.  POST /products/bulk
app.post("/products/bulk", async (req, resp) => {
  const product = await Product.insertMany(Data);
  resp.json({
    message: "Data created sucessfully",
    Products: product,
  });
});

// 3. Get all products
app.get("/products", async (req, resp) => {
  const product = await Product.find();
  resp.status(200).json({
    message: "All Products are here",
    products: product,
  });
});

//  4. Get product by MongoDB id
app.get("/products/id/:id", async (req, resp) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    resp.json({
      message: "product is there",
      product,
    });
  } catch (error) {
    resp.status(400).json({
      message: error.message,
    });
  }
});

// 5. Get product by slug

app.get("/products/slug/:slug", async (req, resp) => {
  const slug = req.params.slug;
  const product = await Product.findOne({ slug: slug });
  if (!product) {
    resp.status(404).json({
      message: "not found ",
    });
  } else {
    resp.status(200).json({
      message: "slug product is there",
      product,
    });
  }
});

// 6. Update product by slug

app.patch("/products/slug/:slug", async (req, resp) => {
  const slug = req.params.slug;
  const { price, stock } = req.body;
  const product = await Product.findOneAndUpdate(
    { slug: slug },
    {
      $set: { price, stock },
    },
    { new: true },
  );
  if (!product) {
    resp.status(404).json({
      message: "Product not found",
    });
  } else {
    resp.status(200).json({
      message: "product updated sucessfully",
      product,
    });
  }
});

// 7. Delete product by slug

app.delete("/products/slug/:slug", async (req, resp) => {
  const slug = req.params.slug;
  const product = await Product.findOneAndDelete({ slug: slug });
  if (!product) {
    resp.status(404).json({
      message: "Product not found",
    });
  } else {
    resp.status(200).json({
      message: "product deleted succesfully",
      product,
    });
  }
});

app.listen(3000, () => {
  console.log(`server is listening on port number 3000`);
});
