const express = require('express');
require('dotenv').config();
const connectDB = require('./db/connect');
const initHbsHelpers = require('./utils/hbs.util');
const initRouters = require('./routes');
const initMiddlewares = require('./config/initMiddlewares');
const hbs = require('hbs');
const log = require('./log');
const app = express();
const PORT = process.env.PORT || 3000;

initMiddlewares(app);
initHbsHelpers(hbs)
initRouters(app);

app.listen(PORT, async () => {
  await connectDB();
  log.info(`http://localhost:${PORT}`);
});
