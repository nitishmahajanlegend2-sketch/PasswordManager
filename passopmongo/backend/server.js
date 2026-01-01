const express = require('express');
const app = express();
const dotenv=require('dotenv').config();
const { MongoClient } = require('mongodb');
const bodyparser=require('body-parser')
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url =process.env.MONGO_URI;
const client = new MongoClient(url);
const cors=require('cors')
// Database Name
const dbName = 'passop';
client.connect();

const PORT = process.env.PORT || 3000;
app.use(bodyparser.json())
app.use(cors())
app.get('/', async(req, res) => {
    const db=client.db(dbName)
    const collection = db.collection('documents');
    const findResult = await collection.find({}).toArray();
    
    
res.json(findResult);
});
app.post('/',async(req,res)=>{
    const password=req.body;
    const db=client.db(dbName)
    const collection = db.collection('documents');
    const findResult = await collection.insertOne(password)
res.send({success:true,result: findResult});

})
app.delete('/',async(req,res)=>{
    const password=req.body;
    const db=client.db(dbName)
    const collection = db.collection('documents');
    const findResult = await collection.deleteOne(password)
res.send({success:true,result: findResult});
})


app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});