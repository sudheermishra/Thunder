import { MongoClient } from "mongodb";

async function runGetStarted() {
  const uri =
  const client = new MongoClient(uri);
  try {
    const database = client.db("Thunder");
    const movies = database.collection("user");
    const query = { title: "Back to the Future" };
    const movie = await movies.insertMany([
      {
        item: "journal",
        qty: 25,
        tags: ["blank", "red"],
        size: { h: 14, w: 21, uom: "cm" },
      },
      {
        item: "mat",
        qty: 85,
        tags: ["gray"],
        size: { h: 27.9, w: 35.5, uom: "cm" },
      },
      {
        item: "mousepad",
        qty: 25,
        tags: ["gel", "blue"],
        size: { h: 19, w: 22.85, uom: "cm" },
      },
    ]);
    console.log(movie);
  } finally {
    await client.close();
  }
}

runGetStarted().catch(console.dir);
