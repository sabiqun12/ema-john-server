const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const app = express()

app.use(express.json());
app.use(cors());

const port = 5000


//console.log(process.env.DB_USER) database connection confirmation

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ooccc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("emaJohnStore").collection("products");
  const orderCollection = client.db("emaJohnStore").collection("orders");
  console.log('database connected')

  app.post('/addProduct', (req, res) => {
      const product = req.body
      //console.log(product)
      productCollection.insertMany(product)
      .then(result => {
       // console.log(result.insertedCount);
        res.send(result.insertedCount)

      })

  })
 // load data and making api for backend.
  app.get('/products', (req, res) => {
    productCollection.find({})
    .toArray((err, documents) => {
      console.log(documents)
      res.send(documents);
    })
  })

  //single product api dynamic for product details page
  app.get('/product/:key', (req, res) => {
    productCollection.find({key: req.params.key})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  // //some product in 1place and we get data from backends
  app.post('/productByKeys', (req, res) => {
    const productsKey = req.body;
    productCollection.find({Key: {$in: productsKey}})
    .toArray( (err, documents) => {
       console.log(documents)
      res.send(documents);
    })
  })

  //order placed code 
  app.post('/orderProduct', (req, res, next) => {
    const product = req.body
    //console.log(product)
    orderCollection.insertOne(product)
    .then(result => {
     console.log(result);
      res.send(result.insertedCount> 0)

    })
    

    
    
   

})

});


app.listen(port);