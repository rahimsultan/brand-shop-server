const express = require('express'); 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors') 
const port = process.env.PORT || 5000

const app = express()

// middleware 
app.use(cors()) 
app.use(express.json())



const uri = "mongodb+srv://rahim:TpTldt0MB4idtbwg@assignment.xa8etjj.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const productsCollection = client.db("productsDB").collection("newProducts");

    app.post('/products', async(req, res)=>{
        const product = req.body;
        console.log(product);
        const result = await productsCollection.insertOne(product);
        res.send(result)
      })

      app.get('/products', async(req, res)=>{
        const cursor = productsCollection.find();
        const products = await cursor.toArray();
        res.send(products)
      })

      app.get('/products/:id',async(req, res)=>{
        const id = req.params.id;
        
        const query = {_id: new ObjectId(id)};
        const result = await productsCollection.findOne(query)
        res.send(result)
      })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{ 
res.send('hello from server') 
})

app.listen(port, ()=>{ 
console.log('server running'); 
})

// TpTldt0MB4idtbwg