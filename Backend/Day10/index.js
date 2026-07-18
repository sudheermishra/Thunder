import express from "express";
import mongoose from "mongoose";
import Customer from "./buildSchema.js";
import Users from "./data.js";

const app = express();

// Connect Node.js application to MongoDB Atlas database
await mongoose.connect(
  "mongodb+srv://username:password@cluster0.mongodb.net/Thunder",
);

// Middleware to parse incoming JSON data
app.use(express.json());

/* ============================
        CREATE OPERATIONS
============================ */

// Create a single customer
app.post("/customer", async (req, resp) => {
  const body = req.body;

  // create() inserts a new document into the collection.
  // We use await because database operations are asynchronous.
  const customer = await Customer.create(body);

  resp.json({
    message: "Customer created successfully",
    customer,
  });
});

// Insert multiple customers at once
app.post("/customer/bulk", async (req, resp) => {
  // insertMany() is used to insert multiple documents in one query
  const customer = await Customer.insertMany(Users);

  resp.json({
    message: "Customers created successfully",
    customer,
  });
});

/* ============================
         READ OPERATIONS
============================ */

// Get all customers
app.get("/customer", async (req, resp) => {
  // find() without any filter returns all documents
  const customer = await Customer.find();

  resp.json({
    message: "All customer information",
    customer,
  });
});

// Filter customers using query parameters
// Example:
// /customer/filter?city=Delhi
// /customer/filter?accountType=current

// IMPORTANT:
// This route must be above "/customer/:accountNumber"
// because Express checks routes from top to bottom.
// Otherwise "/customer/filter" will be treated as
// accountNumber = "filter".

app.get("/customer/filter", async (req, resp) => {
  // req.query already contains an object
  // Example:
  // {
  //   city: "Delhi",
  //   accountType: "saving"
  // }

  const customer = await Customer.find(req.query);

  resp.json({ customer });
});

// Get a customer using account number
app.get("/customer/:accountNumber", async (req, resp) => {
  // Route parameters are available in req.params
  const accountValue = req.params.accountNumber;

  // findOne() returns the first matching document
  const customer = await Customer.findOne({
    accountNumber: accountValue,
  });

  if (!customer) {
    return resp.json({
      message: "Customer doesn't exist",
    });
  }

  resp.json({
    message: "Customer information",
    customer,
  });
});

/* ============================
       DELETE OPERATION
============================ */

app.delete("/customer/:accountNumber", async (req, resp) => {
  // findOneAndDelete() finds the document and deletes it
  const customer = await Customer.findOneAndDelete({
    accountNumber: req.params.accountNumber,
  });

  if (!customer) {
    return resp.json({
      message: "Customer doesn't exist",
    });
  }

  resp.json({
    message: "Customer deleted successfully",
    customer,
  });
});

/* ============================
       UPDATE OPERATIONS
============================ */

// Update city and age
app.patch("/customer/:accountNumber", async (req, resp) => {
  const { city, age } = req.body;

  // findOneAndUpdate()
  // 1st argument -> Filter document
  // 2nd argument -> Update operation
  // 3rd argument -> Options
  //
  // new:true returns the updated document.
  // Otherwise Mongoose returns the old document.

  const user = await Customer.findOneAndUpdate(
    { accountNumber: req.params.accountNumber },
    {
      $set: {
        city,
        age,
      },
    },
    { new: true },
  );

  resp.json(user);
});

// Deposit money
app.patch("/customer/deposit/:accountNumber", async (req, resp) => {
  const { balance } = req.body;

  // Fetch customer document
  const user = await Customer.findOne({
    accountNumber: req.params.accountNumber,
  });

  // Increase existing balance
  user.balance += balance;

  // Changes are only in memory until save() is called.
  // save() writes the updated document to MongoDB.
  await user.save();

  resp.json(user);
});

// Withdraw money
app.patch("/customer/withdraw/:accountNumber", async (req, resp) => {
  const { balance } = req.body;

  const user = await Customer.findOne({
    accountNumber: req.params.accountNumber,
  });

  // Decrease balance
  user.balance -= balance;

  // Persist changes to database
  await user.save();

  resp.json(user);
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
