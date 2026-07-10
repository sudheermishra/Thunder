import http from "http";

let dataBase = [
  { name: "sudheer", email: "sudheer@123", age: 22 },
  { name: "anil", email: "anil@123", age: 25 },
];

const server = http.createServer((req, resp) => {
  if (req.method == "GET" && req.url == "/user") {
    resp.end(JSON.stringify(dataBase, null, 2));
  } else if (req.method == "POST" && req.url == "/user") {
    // Frontend jab POST request bhejta hai, to data request body me aata hai.
    // Yeh data ek saath nahi aata, balki chhote-chhote packets (chunks) me aata hai.

    // Node.js me req.body by default available nahi hota.
    // Isliye hume request ke saare chunks ko khud collect karna padta hai.

    let body = "";

    // "data" event har baar fire hota hai jab request ka ek naya chunk receive hota hai.
    // Har chunk ko body string me append karte rehte hain.
    req.on("data", (chunk) => {
      body += chunk;
    });

    // Jab saare chunks receive ho jaate hain,
    // tab "end" event fire hota hai.
    // Is point par body me complete data hota hai.
    req.on("end", () => {
      // Body JSON string ke form me hoti hai.
      // JSON.parse() use JavaScript object me convert kar deta hai.
      const user = JSON.parse(body);

      // User object ko database (array) me store kar dete hain.
      dataBase.push(user);

      // Client ko success response bhej dete hain.
      resp.end("Data created successfully");
    });
  } else if (req.method == "PATCH" && req.url == "/user") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;

      req.on("end", () => {
        const users = JSON.parse(body);
        const findUser = dataBase.find((user) => {
          return user.email == users.email;
        });
        Object.assign(findUser, users);
        resp.end("information  updated successfully");
      });
    });
  }

  // Agar hum sirf Node.js ke http module ka use karein,
  // to POST, PUT aur PATCH requests me body ka data manually handle karna padta hai.

  // Request body ek saath nahi aati, balki chunks (packets) me aati hai.
  // Isliye hume har baar:
  // 1. Ek variable (body) banana padta hai.
  // 2. "data" event se saare chunks collect karne padte hain.
  // 3. "end" event ka wait karna padta hai.
  // 4. JSON.parse() karke JavaScript object me convert karna padta hai.

  // Yehi process POST, PUT aur PATCH me baar-baar repeat hoti hai,
  // jisse code repetitive aur maintain karna mushkil ho jata hai.

  // Sirf body handle karna hi nahi,
  // routing bhi manually if-else se karni padti hai.

  // Agar aaj sirf "/user" route hai to theek hai,
  // lekin kal "/product", "/order", "/payment", "/cart" jaise
  // aur bhi resources aa jayenge to har route ke liye
  // alag-alag if-else likhne padenge.

  // Example:

  // GET    /product
  // POST   /product
  // PATCH  /product
  // PUT    /product
  // DELETE /product

  // Phir "/user", "/order", "/cart" ke liye bhi
  // wahi pattern dobara likhna padega.

  // Is wajah se code bahut bada, repetitive aur difficult to maintain ho jata hai.

  // Isi problem ko solve karne ke liye Express use kiya jata hai.

  // Express me:
  // ✔ Routing bahut clean ho jati hai (app.get(), app.post(), app.put(), etc.).
  // ✔ express.json() request body ko automatically collect aur parse kar deta hai.
  // ✔ Code readable, reusable aur maintainable ban jata hai.
  // ✔ Large applications banana aur manage karna kaafi easy ho jata hai.

  if (req.method == "GET" && req.url == "/product") {
    res.end("Hello Coder Army");
  } else if (req.method == "POST" && req.url == "/product") {
    res.end("User Data is created successfully");
  } else if (req.method == "PATCH" && req.url == "/product") {
    res.end("User Data is patched successfully");
  } else if (req.method == "PUT" && req.url == "/product") {
    res.end("User Data is Put successfully");
  } else if (req.method == "DELETE" && req.url == "/product") {
    res.end("User Data is Deleted successfully");
  } else {
    res.end("Invalid Path");
  }

  // isliye yeh kitna complex isliye hum express use krte h usme code ek dum clean ho jata h
});

server.listen(3000, () => {
  console.log("server is listening on port number 3000");
});
