
import { MongoClient, ServerApiVersion }  from 'mongodb';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGO_DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export async function insertUser(user) {  //per inserire cose nelle collection
  try {
    await client.connect()
    const database = client.db(process.env.MONGODB_DBNAME);  //nome del database
    const usersCollection = database.collection("users");  // collection: oggetto che contiene in questo caso users

    const result = await usersCollection.insertOne(user);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } catch(err) { //per gestire l'eccezione che farebbe crashare il server. 
      console.log(err);
  } finally {
    await client.close();
  }
}


export async function getUser(user) {
  try{
    await client.connect()
    const database = client.db(process.env.MONGODB_DBNAME);  
    const usersCollection = database.collection("users");  

    let foundUsers = await usersCollection.findOne(user)
    console.log(foundUsers);
    // for await (const doc of cursor) {
    //   console.dir(doc);
    // }
    return foundUsers
  }catch(err) {
      console.log(err);
  }finally {
      await client.close();
  }
}


export async function deleteUserMongo(user) {
  try{
    await client.connect()
    const database = client.db(process.env.MONGODB_DBNAME);  
    const usersCollection = database.collection("users");  

    let foundUsers = await usersCollection.deleteOne(user)
    console.log('userdeleted');
    // for await (const doc of cursor) {
    //   console.dir(doc);
    // }
    return foundUsers
  }catch(err) {
      console.log(err);
  }finally {
      await client.close();
  }
}


export async function updateUser(filter, update) {
  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_DBNAME);
    const usersCollection = database.collection("users");

    const result = await usersCollection.updateOne(filter, update);
    console.log(`Modified ${result.modifiedCount} document(s)`);

    return result;
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}