import express from "express";
const app = express();

let dataBase = [
  {
    id: 1,
    name: "Sudheer",
    course: "MCA",
    age: 22,
    email: "sudheer123@gmail.com",
  },
  {
    id: 2,
    name: "Anil",
    course: "MCA",
    age: 24,
    email: "Anil123@gmail.com",
  },
];

app.use(express.json());

app.get("/user", (req, resp) => {
  resp.send(JSON.stringify(dataBase), null, 2);
});

app.post("/user", (req, resp) => {
  const body = req.body;
  for (let i = 0; i < dataBase.length; i++) {
    if (dataBase[i].id != Number(body.id)) {
      dataBase.push(body);
      resp.send("data created successfully");
      break;
    }
  }
  dataBase.push(body);
  resp.send("id already exists");
});

app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
