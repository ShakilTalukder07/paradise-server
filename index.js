const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middle wares
app.use(cors());
app.use(express.json());


// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1ndgjy2.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try {
        
        const serviceCollection = client.db('paradise').collection('services')
        const limitedServiceCollection = client.db('paradise').collection('limitedServices')
        const reviewsCollection = client.db('paradise').collection('totalReviews')

        app.get('/limitedServices', async(req, res)=>{
            const query = {}
            const cursor = limitedServiceCollection.find(query)
            const limitedServices = await cursor.limit(3).toArray();
            res.send(limitedServices);
        });

        app.get('/services', async(req, res)=>{
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.send(service);
        });

        app.post('/services', async(req, res)=>{
            const totalServices = req.body;
            const result = await serviceCollection.insertOne(totalServices)
            res.send(result);
        });

        // post and get reviews 

        app.post('/totalReviews', async(req, res)=>{
            const totalReviews = req.body;
            const review = await reviewsCollection.insertOne(totalReviews)
            res.send(review)
        });

        app.get('/totalReviews', async(req, res)=>{
            let query ={}
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewsCollection.find(query)
            const review = await cursor.toArray()
            res.send(review);
        });

        app.delete('/totalReviews/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.send(result); 
        })

    } 
    finally {
        
    }
}
run().catch(error => console.error(error))



app.get('/', (req, res) => {
    res.send('paradise server is running')
})

app.listen(port, () => {
    console.log(`Paradise server is running on ${port}`);
})