// crud operation

const http = require("http");
const url = require("url");
let dataBase = [
  { name: "sudheer", email: "sudheer@123", age: 22 },
  { name: "anil", email: "anil@123", age: 25 },
];

function createUser(path) {
  dataBase.push(path);
}

function deleteUser(email) {
  for (let i = 0; i < dataBase.length; i++) {
    if (dataBase[i].email == email) {
      dataBase.splice(i, 1);
      break;
    }
  }
}

function updateUser(query) {
  for (let i = 0; i < dataBase.length; i++) {
    if (dataBase[i].email == query.email) {
      dataBase[i].age = query.age;
      dataBase[i].name = query.name;
      dataBase[i].email = query.email;
    }
  }
}

const server = http.createServer((req, resp) => {
  const parsed = url.parse(req.url, true);
  const pathName = parsed.pathname.slice(1);

  if (pathName === "createuser") {
    // jo bhi query aayegi woh object ke form me aayegi toh hum object hi pass kr denege function me and woh function hamare database me push kr dega
    if (Object.keys(parsed.query).length === 0) {
      resp.end("pass the value");
      return;
    }
    createUser(parsed.query);
    resp.end("User created");
    return;
  } else if (pathName === "deleteuser") {
    deleteUser(parsed.query.email);
    resp.end("User deleted");
    return;
  } else if (pathName == "getuser") {
    resp.end(JSON.stringify(dataBase));
  } else if (pathName == "updateuser") {
    updateUser(parsed.query);
    resp.end("user updated");
  }
});

server.listen(3000, () => {
  console.log("server is listening on port number 3000");
});
