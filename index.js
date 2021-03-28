const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = 5000;
const MongoClient = require('mongodb').MongoClient;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uri = process.env.DATABASE;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const products = client.db('ema-john-store').collection('products');
  const orders = client.db('ema-john-store').collection('orders');

  app.post('/addProduct', (req, res) => {
    const singleProduct = req.body;
    products.insertOne(singleProduct).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
  });

  app.get('/products', (req, res) => {
    products.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get('/product/:key', (req, res) => {
    products.find({ key: req.params.key }).toArray((err, docuemnts) => {
      res.send(docuemnts[0]);
    });
  });

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    products
      .find({ key: { $in: productKeys } })
      .toArray((err, documents) => res.send(documents));
  });

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    orders.insertOne(order).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });
});

app.listen(port, () => {
  console.log(` server is listening on port ${port}`);
});
