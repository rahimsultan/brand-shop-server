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
    const cartCollection = client.db("productsDB").collection("cartedProducts");

    // for all product
    app.post('/products', async(req, res)=>{
        const product = req.body;
        console.log(product);
        const result = await productsCollection.insertOne(product);
        res.send(result)
      })

      //for carted product
      app.post('/cart/products', async(req, res)=>{
        const product = req.body;
        console.log(product);
        const result = await cartCollection.insertOne(product);
        res.send(result)
      })

      // get Carted Product for client side
      app.get('/cart/products', async(req, res)=>{
        const cursor = cartCollection.find();
        const products = await cursor.toArray();
        res.send(products)
      })

      // get all product for client side
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

      app.get('/product/:brandname',async(req, res)=>{
        const brandName = req.params.brandname;
        console.log(brandName);
        
        const query = {brand: brandName};
        const result = await productsCollection.find(query).toArray()
        res.send(result)
      })

      app.put('/products/:id', async(req, res)=>{
        const id = req.params.id;
        const product = req.body;

        const filter = {_id: new ObjectId(id) };
        const options = { upsert: true };
  
        const updateProduct = {
          $set:{
            photo: product.photo,
            title: product.title,
            brand: product.brand,
            category: product.category,
            price: product.price,
            rating: product.rating,
          }
        }
  
        const result = await productsCollection.updateOne(filter, updateProduct, options)
        res.send(result)
      })


      // delete product from cart 
      app.delete('/cart/products/:id', async(req, res)=>{
        const id = req.params.id;

        const query = {_id: new ObjectId(id)}
        const result = await cartCollection.deleteOne(query)
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
res.send('Hello From assignment server') 
})

app.listen(port, ()=>{ 
console.log('server running'); 
})

// TpTldt0MB4idtbwg