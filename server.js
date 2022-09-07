const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./db/connect');
const PORT = process.env.PORT || 3000;

const AdminJSExpress = require('@adminjs/express')
const adminJs = require('./config/admin')
const router = AdminJSExpress.buildRouter(adminJs)
app.use(adminJs.options.rootPath, router)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/user', require('./routes/auth'));
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, async () => {
    await connectDB();

    console.log(`http://localhost:${PORT}`);
});