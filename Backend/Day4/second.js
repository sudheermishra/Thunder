const http = require("http");
const url = require("url");

let dataBase = [
  { id: 1, name: "sudheer", email: "sudheer@123", age: 22 },
  { id: 2, name: "anil", email: "anil@123", age: 25 },
];

function createUser(path) {
  dataBase.push(path);
}

function deleteUser(id) {
  for (let i = 0; i < dataBase.length; i++) {
    if (dataBase[i].id == Number(id)) {
      dataBase.splice(i, 1);
      break;
    }
  }
}

function updateUser(query) {
  for (let i = 0; i < dataBase.length; i++) {
    if (dataBase[i].id == Number(query.id)) {
      dataBase[i].age = query.age;
      dataBase[i].name = query.name;
      dataBase[i].email = query.email;
    }
  }
}

const server = http.createServer((req, resp) => {
  const parsed = url.parse(req.url, true);

  const pathName = parsed.pathname.slice(1);

  // createUser

  if (pathName === "createuser") {
    if (parsed.query.id && parsed.query.email && parsed.query.name) {
      for (let i = 0; i < dataBase.length; i++) {
        if (
          dataBase[i].id == Number(parsed.query.id) ||
          dataBase[i].email == parsed.query.email
        ) {
          resp.end("Email already exists");
          return;
        }
      }
      createUser(parsed.query);
      resp.end("user created");
      return;
    } else {
      resp.end("Enter id, name and email");
      return;
    }
  }

  //deleteuser
  else if (pathName === "deleteuser") {
    deleteUser(parsed.query.id);
    resp.end("user deleted");
    return;
  }

  // updateuser
  else if (pathName === "updateuser") {
    updateUser(parsed.query);
    resp.end("user updated");
    return;
  }

  // getuser
  else if (pathName === "getuser") {
    // /getuser?email=sudheer@123
    if (parsed.query.email) {
      for (let i = 0; i < dataBase.length; i++) {
        if (dataBase[i].email === parsed.query.email) {
          return resp.end(JSON.stringify(dataBase[i]));
          break;
        }
      }

      resp.end("Invalid email");
      return;
    } else {
      resp.end(JSON.stringify(dataBase));
      return;
    }
  }
});

server.listen(3000, () => {
  console.log("server is listening on port number 3000");
});
