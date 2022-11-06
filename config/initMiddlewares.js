const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const adminJs = require('./admin');
const AdminJSExpress = require('@adminjs/express');
const persistance = require('../middleware/checkPersistance');
const flash = require('express-flash');
const session = require('express-session');
const path = require('path')
const initMiddlewares = (app) => {
  app.use(cors());
  const router = AdminJSExpress.buildRouter(adminJs);
  app.use(adminJs.options.rootPath, router);
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: false, limit: '50mb' }));
  app.use(cookieParser());
  app.use(persistance);
  app.set('view engine', 'hbs');
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }));
  app.use(flash());
  app.use(express.static(path.resolve(__dirname, '../static')))

}

module.exports = initMiddlewares;