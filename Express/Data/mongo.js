import { MongoClient } from "mongodb";
const url = "mongodb+srv://muhamedtammaa:Mohamedh%401@saycret.uc0os8b.mongodb.net/?retryWrites=true&w=majority&appName=Saycret";
const client = new MongoClient(url);

const main = async ()=>{
    await client.connect();
    console.log("server is connected successfully");

    const db = client.db("Saycret");
    const collection = db.collection("posts");
    const data = await collection.find().toArray();
    console.log(data);
}
main();