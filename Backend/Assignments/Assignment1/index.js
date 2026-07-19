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

//                                Part 2: Search and Filter APIs

// 8. Search products by brand
app.get("/products/search/brand", async (req, resp) => {
  const { brand } = req.query;
  try {
    const products = await Product.find({ brand: brand.toLowerCase() });
    // yeh product hume array return krke dega so agar kuch bhi nhi mila toh empty array dega toh isliye product.length ===0
    if (products.length === 0) {
      return resp.status(404).json({
        message: "Product not found",
      });
    } else {
      resp.status(200).json({
        products,
      });
    }
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

// 9. Search products by category

app.get("/products/search/category", async (req, resp) => {
  const { category } = req.query;
  try {
    const products = await Product.find({
      category: category.toLocaleLowerCase(),
    });
    if (products.length === 0) {
      return resp.status(404).json({
        message: "Product not found",
      });
    } else {
      resp.status(200).json({
        products,
      });
    }
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

// 10. Search available products
app.get("/products/search/available", async (req, resp) => {
  try {
    const products = await Product.find({ isAvailable: true });
    if (products.length === 0) {
      return res.status(404).json({
        message: "No available products found",
      });
    }
    resp.status(200).json({
      products,
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

// 11. Search out-of-stock products

app.get("/products/search/out-of-stock", async (req, resp) => {
  try {
    const products = await Product.find({ stock: 0 });
    if (products.length === 0) {
      return res.status(404).json({
        message: "No out-of-stock products found",
      });
    }
    resp.status(200).json({
      products,
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

// 12. Search products by brand and category

app.get("/products/search/brand-category", async (req, resp) => {
  const { brand, category } = req.query;
  try {
    if (brand && category) {
      const products = await Product.find({ brand: brand, category: category });
      if (products.length === 0) {
        return resp.status(404).json({
          message: "Products not found",
        });
      } else {
        return resp.status(200).json({
          products,
        });
      }
    } else {
      return resp.status(400).json({
        message: "Both brand and category query parameters are required",
      });
    }
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

// 13. Search products by brand OR category
app.get("/products/search/brand-or-category", async (req, resp) => {
  const { brand, category } = req.query;
  try {
    if (!brand && !category) {
      return resp.status(400).json({
        message: "Either brand or category is required",
      });
    }

    const products = await Product.find({
      $or: [{ brand: brand }, { category: category }],
    });
    if (products.length === 0) {
      return resp.status(404).json({
        message: "Products not found",
      });
    } else {
      resp.status(200).json({
        products,
      });
    }
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

// 14. Products with price greater than amount
app.get("/products/search/price-greater-than", async (req, resp) => {
  const { amount } = req.query;
  try {
    if (amount === undefined || amount === "") {
      return resp.status(400).json({
        message: "Valid amount is required",
      });
    }
    const products = await Product.find({ price: { $gt: amount } });
    if (products.length === 0) {
      return resp.status(404).json({
        message: "Products not found",
      });
    }
    resp.status(200).json({
      products,
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

// 15. Products with price less than amount
app.get("/products/search/price-less-than", async (req, resp) => {
  const { amount } = req.query;
  try {
    if (amount === undefined || amount === "") {
      return resp.status(400).json({
        message: "Valid amount is required",
      });
    }
    const products = await Product.find({ price: { $lt: amount } });
    if (products.length === 0) {
      return resp.status(404).json({
        message: "Products not found",
      });
    }
    resp.status(200).json({
      products,
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

//16. Products with price between min and max
app.get("/products/search/price-between", async (req, resp) => {
  const { min, max } = req.query;
  try {
    if (min === undefined || (min === "" && max === undefined) || max === "") {
      return resp.status(400).json({
        message: "Valid amount is required",
      });
    }
    const products = await Product.find({ price: { $gte: min, $lte: max } });
    if (products.length === 0) {
      return resp.status(404).json({
        message: "Products not found",
      });
    }
    resp.status(200).json({
      products,
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

// 17. Products with rating greater than given value
app.get("/products/search/rating", async (req, resp) => {
  const { rating } = req.query;
  try {
    const products = await Product.find({ rating: { $gte: rating } });
    if (products.length === 0) {
      resp.status(404).json({
        message: "Products not found",
      });
    }
    resp.status(200).json({
      products,
    });
  } catch (error) {
    message: error.message;
  }
});

// 18. Search products from multiple categories
// Example:
// GET /products/search/categories?categories=electronics,fashion

app.get("/products/search/categories", async (req, resp) => {
  // Query se categories string milegi
  // "electronics,fashion"
  let categories = req.query.categories;

  // String ko array me convert kar diya
  // ["electronics", "fashion"]
  const arr = categories.split(",");

  try {
    // $in ka matlab:
    // category agar arr ke kisi bhi element se match kare
    // to document return kar do.
    const products = await Product.find({
      category: {
        $in: arr,
      },
    });

    // find() hamesha array return karta hai
    // Agar array empty hai to koi product nahi mila
    if (products.length === 0) {
      return resp.status(404).json({
        message: "Products not found",
      });
    }

    // Matching products return kar do
    resp.status(200).json({
      products,
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

// 19. Products not from given category  (User jo category de, us category ke alawa saare products return karo.)
app.get("/products/search/not-category", async (req, resp) => {
  const category = req.query.category;
  try {
    const products = await Product.find({
      category: {
        $ne: category,
      },
    });
    if (products.length === 0) {
      return resp.status(404).json({
        message: "Products not found",
      });
    }
    resp.status(200).json({
      products,
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

// 20. Search product by name
// Example:
// GET /products/search/name?name=dell

app.get("/products/search/name", async (req, resp) => {
  // Query parameter se product ka name liya
  const name = req.query.name;

  try {
    const products = await Product.find({
      name: {
        // $regex partial search ke liye use hota hai
        // "dell" search karne par
        // Dell Inspiron, Dell XPS, Dell Mouse
        // sab return ho jayenge.
        $regex: name,

        // "i" = case insensitive search
        // dell = Dell = DELL = DeLl
        // sab same treat honge.
        $options: "i",
      },
    });

    // find() hamesha array return karta hai
    // Empty array => product nahi mila
    if (products.length === 0) {
      return resp.status(404).json({
        message: "Products not found",
      });
    }

    // Matching products return
    resp.status(200).json({
      products,
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log(`server is listening on port number 3000`);
});
