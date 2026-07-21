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

//                                  Part 3: Sorting and Pagination APIs

// 21. Sort products by price low to high

app.get("/products/sort/price-asc", async (req, resp) => {
  try {
    const products = await Product.find().sort({ price: 1 });
    if (products.length === 0) {
      return resp.status(400).json({
        message: "products not found",
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

// 22. Sort products by price high to low
app.get("/products/sort/price-desc", async (req, resp) => {
  try {
    const products = await Product.find().sort({ price: -1 });
    if (products.length === 0) {
      return resp.status(400).json({
        message: "products not found",
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

// 23. Sort products by rating high to low
app.get("/products/sort/rating-desc", async (req, resp) => {
  try {
    const products = await Product.find().sort({ rating: -1 });
    if (products.length === 0) {
      return resp.status(400).json({
        message: "products not found",
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

//24. Get top 5 expensive products
app.get("/products/top/expensive", async (req, resp) => {
  try {
    const products = await Product.find().sort({ price: -1 }).limit(5);
    if (products.length === 0) {
      return resp.status(400).json({
        message: "products not found",
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

// 25. Pagination API
// Example:
// GET /products/pagination?page=2&limit=5

app.get("/products/pagination", async (req, resp) => {
  // Query parameters hamesha string hote hain
  const { page, limit } = req.query;

  try {
    // Step 1: Check karo ki page aur limit dono aaye hain ya nahi.
    // ! (NOT) operator:
    // Agar value undefined, null ya empty hogi to condition true ho jayegi.
    // || (OR) operator:
    // Dono me se EK bhi condition true hui to if execute hoga.
    if (!page || !limit) {
      return resp.status(400).json({
        message: "Both page and limit are required",
      });
    }

    // Step 2: String ko Number me convert karo.
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    // Step 3: Check karo ki converted values valid numbers hain ya nahi.
    // Examples:
    // page=abc&limit=5  -> true || false -> true
    // page=2&limit=xyz  -> false || true -> true
    // page=2&limit=5    -> false || false -> false
    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return resp.status(400).json({
        message: "Page and limit must be numbers",
      });
    }

    // Pagination Formula:
    // skip = (page - 1) * limit
    //
    // Meaning:
    // skip() starting ke documents ko ignore karta hai.
    //
    // Example 1:
    // page = 1, limit = 5
    // skip = (1 - 1) * 5 = 0
    // Return -> Products 1 to 5
    //
    // Example 2:
    // page = 2, limit = 5
    // skip = (2 - 1) * 5 = 5
    // Pehle 5 products skip honge,
    // fir next 5 products (6-10) return honge.
    //
    // Example 3:
    // page = 3, limit = 5
    // skip = (3 - 1) * 5 = 10
    // Pehle 10 products skip,
    // fir next 5 products (11-15) return honge.
    const skip = (pageNumber - 1) * limitNumber;

    // find() -> Saare products
    // skip() -> Starting ke products ignore
    // limit() -> Sirf itne products return
    const products = await Product.find().skip(skip).limit(limitNumber);

    // find() hamesha array return karta hai.
    // Empty array => koi product nahi mila.
    if (products.length === 0) {
      return resp.status(404).json({
        message: "Products not found",
      });
    }

    // Success response
    resp.status(200).json({
      products,
    });
  } catch (error) {
    // Server/Internal error
    resp.status(500).json({
      message: error.message,
    });
  }
});

//                                 Part 4: Stock, Tags, Reviews

// 26. Increase product stock
app.patch("/products/:slug/stock/increase", async (req, resp) => {
  const quantity = req.body.quantity;
  const slug = req.params.slug;
  try {
    if (!quantity) {
      return resp.status(400).json({
        message: "quantity must be required",
      });
    }

    const quantityNumber = Number(quantity);
    if (isNaN(quantityNumber)) {
      return resp.status(400).json({
        message: "quantity muse be in number",
      });
    }
    if (quantityNumber <= 0) {
      return resp.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    const product = await Product.findOneAndUpdate(
      { slug: slug },
      {
        $inc: { stock: quantityNumber },
      },
      { new: true },
    );
    if (!product) {
      return resp.status(404).json({
        message: "Product not found",
      });
    }

    resp.json(product);
  } catch (error) {
    // Server/Internal error
    resp.status(500).json({
      message: error.message,
    });
  }
});

// 27. Decrease product stock

app.patch("/products/:slug/stock/decrease", async (req, resp) => {
  const quantity = req.body.quantity;
  const slug = req.params.slug;
  try {
    if (!quantity) {
      return resp.status(400).json({
        message: "quantity must be required",
      });
    }

    const quantityNumber = Number(quantity);
    if (isNaN(quantityNumber)) {
      return resp.status(400).json({
        message: "quantity muse be in number",
      });
    }
    if (quantityNumber <= 0) {
      return resp.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    const product = await Product.findOne({ slug: slug });
    if (!product) {
      return resp.status(404).json({
        message: "Product not found",
      });
    }

    if (product.stock < quantityNumber) {
      return resp.status(400).json({
        message: "Insufficient stock",
      });
    }

    // decrement ke liye $inc bss -negative value passs kr do
    const updatedProduct = await Product.findOneAndUpdate(
      { slug: slug },
      { $inc: { stock: -quantityNumber } },
      { new: true },
    );
    if (updatedProduct === 0) {
      updatedProduct.isAvailable = false;
      await updatedProduct.save();
    }

    resp.status(200).json({
      message: "stock quantity decreased",
      updatedProduct,
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

//  28. Add tag to product

app.patch("/products/:slug/tags", async (req, resp) => {
  const slug = req.params.slug;
  const tag = req.body.tag;
  try {
    if (!tag) {
      return resp.status(400).json({
        message: "tag should be required",
      });
    }
    // two methods are there to add like in schemma tag is a array so
    // 1st { $push: { tags: tag }} but this will also add duplicate
    // 2nd { $addToSet: { tags: tag }}  this avoid duplicate
    const product = await Product.findOneAndUpdate(
      { slug: slug },
      { $addToSet: { tags: tag } },
      { new: true },
    );
    if (!product) {
      return resp.status(404).json({
        message: "Product not found",
      });
    }
    resp.status(200).json({
      message: "product updated successfully",
      product,
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

// 29. Remove tag from product

app.patch("/products/:slug/tags/remove", async (req, resp) => {
  const slug = req.params.slug;
  const tag = req.body.tag;
  try {
    if (!tag) {
      return resp.status(400).json({
        message: "tag should be required",
      });
    }

    const product = await Product.findOneAndUpdate(
      { slug: slug },
      {
        $pull: { tags: tag },
      },
      { new: true },
    );
    if (!product) {
      return resp.status(404).json({
        message: "Product not found",
      });
    }
    resp.status(200).json({
      message: "product updated successfully",
      product,
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

// 30. Add review to product

app.patch("/products/:slug/tags/reviews", async (req, resp) => {
  const slug = req.params.slug;
  const review = req.body;
  try {
    if (!review) {
      return resp.status(400).json({
        message: "review should be required",
      });
    }
    const product = await Product.findOneAndUpdate(
      { slug: slug },
      { $push: { reviews: review } },
      { new: true },
    );

    if (!product) {
      return resp.status(404).json({
        message: "Product not found",
      });
    }

    resp.status(200).json({
      product,
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

// 31. GET /products/:slug/reviews
app.get("/products/:slug/reviews", async (req, resp) => {
  const slug = req.params.slug;
  try {
    const product = await Product.findOne({ slug: slug });
    if (!product) {
      resp.status(404).json({
        message: "product not found",
      });
    }
    const reviews = product.reviews;
    console.log(reviews);
    resp.status(200).json({
      reviews,
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

//32. PATCH /products/:slug/reviews/remove-last
app.patch("/products/:slug/reviews/remove-last", async (req, resp) => {
  const slug = req.params.slug;
  try {
    const product = await Product.findOneAndUpdate(
      { slug: slug },
      { $pop: { reviews: -1 } },
      { runValidators: true, new: true },
    );
    if (!product) {
      resp.status(404).json({
        message: "product not found",
      });
    }

    resp.status(200).json({
      product,
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

// 33. PATCH /products/:slug/discount

app.patch("/products/:slug/discount", async (req, resp) => {
  // const slug = req.params.slug;
  const discount = Number(req.body.discount);
  try {
    if (discount < 0 || discount > 90) {
      return resp.status(400).json({
        message: "Discount cannot be negative or cannot be greater than 90",
      });
    }
    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      { discount: discount },
      { runValidators: true, new: true },
    );
    if (!product) {
      return resp.status(404).json({
        message: "product not found",
      });
    }

    resp.status(200).json({
      product,
    });
  } catch (error) {
    resp.status(500).json({
      message: error.message,
    });
  }
});

// 34. GET /products/search/discounted

app.get("/products/search/discounted", async (req, resp) => {
  try {
    const products = await Product.find({ discount: { $gt: 0 } });
    if (products.length === 0) {
      return resp.status(200).json({
        products: [],
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

app.listen(3000, () => {
  console.log(`server is listening on port number 3000`);
});
