const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;



// middleWare-
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tukbsww.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run(){
  const services = client.db('make-my-trip').collection('services');

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

    //post a service-
    app.post('/service', async(req, res) =>{
      const service = req.body;
      const result = await services.insertOne(service)
      res.send(result);
    })





  }
  catch{

  }
  finally{

  }

}
run().catch(err => console.error(err))





async function runReviews(){
  const reviewCollection = client.db('make-my-trip').collection('reviews');
  try{

    //allReviews-
     app.post('/reviews', async(req, res) =>{
      const review = req.body;
      const result = await reviewCollection.insertOne(review)
      res.send(result);
    })

    //get with specific serviceId-
    app.get('/reviews/:id', async(req, res)=>{
      const id = parseInt(req.params.id);
      const query = {serviceId: id}
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray()
      res.send(result);
    })

    //get with specific email id-
    app.get('/reviews', async(req, res)=>{
      const userEmail = req.query.email;
      const query = {userEmail: userEmail};
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray()
      res.send(result)
    })

    //delete one review item with _id-
    app.delete('/reviews/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await reviewCollection.deleteOne(query);
      res.send(result)
    })

    //udate one review item with _id-
    app.patch('/reviews/update/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const review = req.body;
      const option = {upsert: true}
      const updatedReview = {
        $set: {
          reviewText: review.reviewText
        }
      }
      const result = await reviewCollection.updateOne(filter, updatedReview, option)
      res.send(result)
      
    })


    app.get('/reviews/update/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.findOne(query);
      res.send(result)
    })

  }
  catch{
    console.error(error)
  }
}
runReviews().catch(err => console.error(err))



app.get('/', (req, res) =>{
  res.send('make my trip server is running...')
})

app.listen(port)