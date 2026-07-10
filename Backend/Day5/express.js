import express from "express";
const app = express();

// Express me hume http.createServer() banane ki zarurat nahi hoti.
// Express internally Node.js ke http module ka use karta hai.

// app object ke paas HTTP methods hote hain:
// app.get(), app.post(), app.put(), app.patch(), app.delete()

// In methods me hume route direct pass kar dete hain,
// isliye req.url check karne ki zarurat nahi hoti.
// Agar request "/user" par aati hai aur method GET hai,
// to us route ka callback automatically execute ho jata hai.

// "/" Home Route hota hai.
// Is route par generally application ki basic information
// ya welcome message return kiya jata hai.

let dataBase = [
  { name: "sudheer", email: "sudheer@123", age: 22 },
  { name: "anil", email: "anil@123", age: 25 },
];

// ================= Middleware =================

// express.json() ek built-in middleware hai.

// Node.js ke http module me hume manually:
// 1. req.on("data") se chunks collect karne padte the.
// 2. req.on("end") ka wait karna padta tha.
// 3. JSON.parse() se string ko object me convert karna padta tha.

// express.json() ye saara kaam automatically kar deta hai.
// Request body ko collect karta hai,
// JSON parse karta hai,
// aur final JavaScript object req.body me available kara deta hai.

app.use(express.json());

// app.use() middleware register karta hai.

// Jab bhi koi request server par aati hai,
// Express sabse pehle middleware execute karta hai.
// Middleware request aur response ke beech me kaam karta hai.

// Agar request me JSON body hai,
// to express.json() usko parse karke req.body me store kar deta hai.

// Uske baad hi request matching route
// (GET, POST, PATCH, DELETE, etc.) tak pahunchti hai.

// express js line by line code excute krti like humne delete /user kiya toh woh phle use ko chalayegi q ki woh toh har baar chalega and fir phle deekga / yeh nhi get /user yeh bhi nhi post /user yeh bhi nhi for delete /user haan yeh match kr raa h toh isme jo call back funcion usko cahala degi

// ================= Routes =================

app.get("/", (req, resp) => {
  resp.send("Home Page");
});

app.get("/user", (req, resp) => {});

app.post("/user", (req, resp) => {});

app.patch("/user", (req, resp) => {});

app.delete("/user", (req, resp) => {});

app.listen(3000, () => {
  console.log("I am listening at port 3000");
});
