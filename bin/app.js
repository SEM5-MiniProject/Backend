const express = require('express');
require('dotenv').config();
const initHbsHelpers = require('../utils/hbs.util');
const initRouters = require('../routes');
const initMiddlewares = require('../config/initMiddlewares');
const hbs = require('hbs');
const app = express();

initMiddlewares(app);
initHbsHelpers(hbs)
initRouters(app);

module.exports = app;