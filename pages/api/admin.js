import { MongoClient,ObjectId } from "mongodb";

export default async (req, res) => {

  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db();
  const users = db.collection("users");

  let doc = await users.find({}).toArray();
  //console.log(doc)
  res.status(200).json(doc);

}