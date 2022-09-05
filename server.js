const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./db/connect');
const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, async() => {
    await connectDB();
    console.log(`http://localhost:${PORT}`);
});