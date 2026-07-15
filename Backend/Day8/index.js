import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

const DBPath = "./database.txt";

function readDB() {
  // data jo bhi database.txt h woh string m hoga q ki humne txt file banayi h toh wha se data ko read krenge toh string me hi read krenge
  // utf-8 mtlb ki data ko encode krna mtlb data ko wha p at the end binary me conver krraa hoga woh code so hume encode toh krna padega
  const data = fs.readFileSync(DBPath, "utf-8");
  // data ko hume parse toh krna padega js object me
  //convert string into javascript object
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(DBPath, JSON.stringify(data, null, 2));
}

app.get("/", (req, resp) => {
  resp.send("Movie Api is runing");
});

app.get("/movies/:id", (req, resp) => {
  const id = req.params.id;
  const db = readDB();
  const user = db.find((data) => {
    return data.id == id;
  });

  if (user) {
    resp.json(user);
  } else {
    resp.status(404).json({ message: "movie not found" });
  }
});

app.post("/movies", (req, resp) => {
  const body = req.body;
  console.log(body);
  let db = readDB();
  console.log("DB:", db);
  db.push(body);
  writeDB(db);

  resp.status(200).json({ message: "Data created sucessfully", movie: body });
});

//  Filter Movies Using Query Parameters
// example GET /movies?genre=comedy

app.get("/movies", (req, resp) => {
  const { genre, language, rating, releaseYear, availableOnOTT, search } =
    req.query;
  let filteredMovie = readDB();
  if (genre) {
    filteredMovie = filteredMovie.filter((movie) => {
      return movie.genre == genre;
    });
  }
  if (language) {
    filteredMovie = filteredMovie.filter((movie) => {
      return movie.language == language;
    });
  }
  if (rating) {
    filteredMovie = filteredMovie.filter((movie) => {
      return movie.rating >= Number(rating);
    });
  }
  if (releaseYear) {
    filteredMovie = filteredMovie.filter((movie) => {
      return movie.releaseYear == releaseYear;
    });
  }
  if (availableOnOTT) {
    filteredMovie = filteredMovie.filter((movie) => {
      return (movie.availableOnOTT = availableOnOTT);
    });
  }
  if (search) {
    filteredMovie = filteredMovie.filter((movie) => {
      return (
        movie.title ==
        search.charAt(0).toUpperCase() + search.slice(1).toLowerCase()
      );
    });
  } else {
    resp.json(filteredMovie);
  }
  resp.json(filteredMovie);
});

// PATCH: Existing object ko modify karta hai (partial update). Isliye find() se object ka reference lekar sirf required fields update karte hain.
app.patch("/movies/:id", (req, resp) => {
  const id = Number(req.params.id);
  const body = req.body;

  const db = readDB();

  const movie = db.find((movie) => {
    return movie.id === id;
  });

  if (movie) {
    for (let key in body) {
      movie[key] = body[key];
    }

    writeDB(db);
    resp.json({
      message: "Movie updated successfully",
      movie: movie,
    });
  } else {
    resp.status(404);
  }
});

// PUT: Existing object ko poori tarah replace karta hai (complete replacement). Isliye findIndex() se object ka index nikalte hain aur us index par naya object assign kar dete hain.
app.put("/movies/:id", (req, resp) => {
  const id = Number(req.params.id);
  const body = req.body;

  const db = readDB();
  const movieIndex = db.findIndex((movie) => {
    return movie.id === id;
  });

  //   Kyunki findIndex() agar object na mile to -1 return karta hai.

  if (movieIndex !== -1) {
    db[movieIndex] = body;
    writeDB(db);
    return resp.status(200).json({ message: "data upadted sucessfully" });
  } else {
    return resp.status(404).json({
      message: "Movie not found",
    });
  }
});

app.delete("/movies", (req, resp) => {
  const id = Number(req.body.id);
  const db = readDB();
  const data = db.filter((movie) => {
    return movie.id !== id;
  });
  writeDB(data);
  resp.status(200).json({ message: "data deleted sucessfully" });
});

app.listen(3000, () => {
  console.log("app is listening on port number 3000");
});

// req.body me client sirf wahi fields bhejta hai jo update karni hoti hain.
// Example:
// {
//   "title": "Sholay",
//   "rating": 5.6
// }

// movie koi naya object nahi hai.
// movie variable db array ke andar wale object ka reference store karta hai.
// Isliye movie me change karne se db ke andar wala object bhi change ho jata hai.

// for (let key in body) {

// for...in body object ki har key ko ek-ek karke access karta hai.

// 1st Iteration:
// key = "title"

// 2nd Iteration:
// key = "rating"

// movie[key] ka matlab hai dynamic property access.
// Agar key = "title" hai to
// movie[key] = body[key]
// ban jayega:
// movie["title"] = body["title"]

// Agar key = "rating" hai to
// movie[key] = body[key]
// ban jayega:
// movie["rating"] = body["rating"]

// Is tarah sirf wahi fields update hongi
// jo client request body me bhejega.

//   movie[key] = body[key];
// }

// Kyunki movie db ke object ka reference tha,
// isliye db array already update ho chuka hai.

// Ab bas updated db ko file me save karna hai.
// writeDB(db);
