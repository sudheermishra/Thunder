import express from "express";
import { movies } from "./movies.js";
const app = express();

app.use(express.json());

// middleware
app.use("/movies", (req, resp, next) => {
  console.log(req.method, req.url);
  next();
});

app.get("/", (req, resp) => {
  resp.send("Movie Api Is Running");
});

//for single movie
app.get("/movies/:id", (req, resp) => {
  const id = req.params.id;
  const filterMovie = movies.find((movie) => {
    return movie.id == Number(id);
  });

  if (filterMovie) {
    resp.json(filterMovie);
  } else {
    resp.status(404).json({
      message: "Movie not found",
    });
  }
});

//  Filter Movies Using Query Parameters
// example GET /movies?genre=comedy

app.get("/movies", (req, resp) => {
  console.log(req.query);
  const { genre, language, rating, releaseYear, availableOnOTT, search } =
    req.query;
  let filteredMovie = movies;

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

app.post("/movies", (req, resp) => {
  const body = req.body;
  movies.push(body);
  resp.status(201).json({
    message: "Movie created successfully",
    body,
  });
});

app.patch("/movies/:id", (req, resp) => {
  const id = Number(req.params.id);
  const fetchMovie = movies.find((movie) => movie.id == id);
  const body = req.body;
  if (fetchMovie) {
    for (let key in body) {
      fetchMovie[key] = body[key];
    }
    resp.json({
      message: "Movie updated successfully",
      movie: fetchMovie,
    });
  } else {
    resp.status(404);
  }

  console.log(fetchMovie);
});

app.put("/movies/:id", (req, resp) => {
  const id = req.params.id;
  const body = req.body;

  let fetchMovie = movies.find((movie) => {
    return movie.id == id;
  });

  if (fetchMovie) {
    Object.assign(fetchMovie, body);
    resp.json({ message: "Movie replaced successfully", movie: body });
  } else {
    resp.status(404, {
      message: "Movie not found",
    });
  }
});

app.delete("/movies/:id", (req, resp) => {
  const id = Number(req.params.id);
  const mov = movies.find((movie) => movie.id == id);
  const index = movies.findIndex((movie) => movie.id === id);
  console.log(index);
  if (index >= 0) {
    movies.splice(index, 1);
    resp.json({ message: "Movie deleted successfully", movie: mov });
  } else {
    resp.status(404).json({
      message: "Movie not found",
    });
  }
});

app.listen(3000, () => {
  console.log("server is listening on port no 3000");
});
