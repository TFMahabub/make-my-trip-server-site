const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;



// middleWare-
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tukbsww.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });



async function run(){
  const services = client.db('make-my-trip').collection('services')

  try{

    //services-
    app.get('/services', async(req, res) =>{
      const query = {}
      const cursor = services.find(query);
      const result = await cursor.toArray()
      res.json(result)
    })
    app.get('/home_services', async(req, res) =>{
      const query = {}
      const cursor = services.find(query);
      const result = await cursor.limit(3).toArray()
      res.send(result)
    })
    app.get('/service/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {servicesId: parseInt(id)}
      const result = await services.findOne(query);
      res.send(result)
    })












    // app.delete('/product/:id', async(req, res) =>{
    //   const id = req.params.id;
    //   const query = {_id: ObjectId};
    //   const result = await productsCollection.deleteOne(query);
    //   res.send(result);
    // })





  }
  catch{

  }
  finally{

  }

}
run().catch(err => console.error(err))































app.get('/', (req, res) =>{
  res.send('make my trip server is running...')
})

app.listen(port)