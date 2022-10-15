const express = require('express')
const app = express()
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yz5fu6r.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

      async function run(){
          try{
             await client.connect();
             const productCollection = client.db('panda').collection('products');
             const orderCollection = client.db('panda').collection('orders');
           
            //   get all product api 
            app.get('/products', async(req,res)=>{
                const query = {};
                const cursor = productCollection.find(query);
                const products = await cursor.toArray();
                res.send(products);
            });

            // get one product by id 
            app.get('/products/:id', async(req,res)=>{
                const id = req.params.id.trim();
                const query = { _id:ObjectId(id)};
                const product = await productCollection.findOne(query);
                res.send(product);
            });
           
            // booking api
            app.post('/order', async(req,res)=>{
                  
                 const order = req.body;
                 const result = await orderCollection.insertOne(order);
                 res.send(result);   
            });
            


          }

          finally{

          }

       }

run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello I am from panda server')
})

app.listen(port, () => {
  console.log(`Panda app listening on port ${port}`)
})