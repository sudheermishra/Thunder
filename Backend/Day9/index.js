import { MongoClient } from "mongodb";

async function runGetStarted() {
  const uri = "";
  const client = new MongoClient(uri);
  try {
    const database = client.db("Thunder");
    const movies = database.collection("user");
    const query = { title: "Back to the Future" };
    const movie = await movies.insertOne([{
        item: "pen",
        qty: 25
      }];
    console.log(movie);
  } finally {
    await client.close();
  }
}

runGetStarted().catch(console.dir);
