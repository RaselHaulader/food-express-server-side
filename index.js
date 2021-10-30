const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;

// middle wire 
app.use(cors())
app.use(express.json())
/* 

*/
const uri = `mongodb+srv://${process.env.SERVER_USER}:${process.env.SERVER_USER_PASS}@cluster0.x89oq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        console.log('connected mdb')
        const database = client.db('FoodExpress')
        const offersCollection = database.collection('offers')
        const ordersCollection = database.collection('allOrders')
        
        // GEt All Offers GET API
        app.get('/offers', async(req,res)=>{
            const query = offersCollection.find({})
            const result = await query.toArray()
            res.json(result)
            
        })

        // GET Single offer by id GET API
        app.get('/offers/:id', async(req,res)=>{
            const id = req.params.id
            const query = {_id : ObjectId(id)}
            const result = await offersCollection.findOne(query)
            res.json(result)
        })

        // postOrder POST API
        app.post('/postOrder', async(req, res)=>{
             const orderData = req.body
             const result =await ordersCollection.insertOne(orderData)
             res.json(result);
        })
        

        // display order by per user PUT API
        app.put("/userOrder/:email", async(req,res)=>{
            const email = req.params.email;
            const query = { email : email}
            const result =await ordersCollection.find(query).toArray();
            res.json(result)
        })

        // cancel order by user
        app.delete('/order/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            res.json(result)
        })

        // get all orders
        app.get('/allOrders', async(req,res)=>{
            const result = await ordersCollection.find({}).toArray()
            res.json(result);
        })

        // API PUT approve
        app.put('/approve/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id : ObjectId(id)};
            const approved = {
                $set: {status : 'Approved'}
            }
            const result = await ordersCollection.updateOne(query,approved)
            res.json(result)
        })

        //POST API for add an new offer
        app.post('/addOffer', async(req,res)=>{
            const data = req.body;
            console.log(data)
            const result = await offersCollection.insertOne(data);
            res.json(result)
        })



    } finally {

    }



} run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('hitted server')
})

app.listen(port, () => {
    console.log('listening to port : ', port)
})