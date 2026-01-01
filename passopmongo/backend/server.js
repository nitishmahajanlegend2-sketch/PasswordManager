const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser');
const cors = require('cors');

const url = process.env.MONGO_URI;
const client = new MongoClient(url);
const dbName = 'passop';

// Connect to MongoDB once when server starts
client.connect().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Failed to connect to MongoDB", err);
});

const PORT = process.env.PORT || 3000;

app.use(bodyparser.json());
app.use(cors({
  allowedHeaders: ['Content-Type', 'user-id']
}));

// --- ROUTES ---

// 1. GET: Fetch only passwords belonging to the specific userId
app.get('/', async (req, res) => {
    const userId = req.headers['user-id']; // Extract ID from the frontend header
    if (!userId) return res.status(400).json({ error: "User ID header is missing" });

    const db = client.db(dbName);
    const collection = db.collection('documents');
    
    // Filter by userId so users only see their own data
    const findResult = await collection.find({ userId: userId }).toArray();
    res.json(findResult);
});

// 2. POST: Save password and attach the userId to the document
app.post('/', async (req, res) => {
    const passwordData = req.body;
    const userId = req.headers['user-id']; // Identify the user
    if (!userId) return res.status(400).json({ error: "User ID header is missing" });

    const db = client.db(dbName);
    const collection = db.collection('documents');
    
    // We spread the password data and add the userId field
    const findResult = await collection.insertOne({ ...passwordData, userId });
    res.send({ success: true, result: findResult });
});

// 3. DELETE: Ensure a user can only delete their own password
app.delete('/', async (req, res) => {
    const { id } = req.body; // This is the uuid generated in Manager.jsx
    const userId = req.headers['user-id'];
    if (!userId) return res.status(400).json({ error: "User ID header is missing" });

    const db = client.db(dbName);
    const collection = db.collection('documents');
    
    // Important: We match BOTH the password id and the userId for security
    const findResult = await collection.deleteOne({ id: id, userId: userId });
    res.send({ success: true, result: findResult });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
