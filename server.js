const express = require('express');
require('dotenv').config();
const AdminJSExpress = require('@adminjs/express');
const connectDB = require('./db/connect');
const adminJs = require('./config/admin');
const { serve, setup } = require('./utils/swagger.util');
const log = require('./log');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const cart_Route = require("./routes/cart");

app.use(cors());
const PORT = process.env.PORT || 3000;
const router = AdminJSExpress.buildRouter(adminJs);
app.use(adminJs.options.rootPath, router);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/user', require('./routes/auth'));
app.use('/seller', require('./routes/seller'));
app.use('/api-docs', serve, setup);
app.use('/add-to-cart', require('./routes/cart'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, async () => {
  await connectDB();

  log.info(`http://localhost:${PORT}`);
});
