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
const path = require('path')
app.use(cors());
const PORT = process.env.PORT || 3000;
const router = AdminJSExpress.buildRouter(adminJs);
app.use(adminJs.options.rootPath, router);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
const persistance = require('./middleware/checkPersistance');
app.use(persistance);
const hbs = require('hbs');
const flash = require('express-flash');
const session = require('express-session');
app.set('view engine', 'hbs');
app.use(express.static(path.resolve(__dirname, './static')))
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('ifNotEquals', function (arg1, arg2, options) {
  return (arg1 !== arg2) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('splitDate', function (title) {
  // convert date to ISO format
  const date = new Date(title).toISOString();
  // split date and time
  const [dateOnly, ] = date.split('T');
  // return date only
  console.log(dateOnly);
  return dateOnly;
});
// convert date to javascript date in yyyy-mm-dd format
hbs.registerHelper('date', function (date) {
  // convert date to ISO format
  date = new Date(date).toISOString();
  var t = date.toString().split("05");
  var d = new Date(t[0]);
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var day = d.getDate().toString().length == 1 ? '0' + d.getDate() : d.getDate();
  return year + "-" + month + "-" + day;
});
// subtract two numbers
hbs.registerHelper('subtract', function (a, b) {
  a = parseInt(a);
  b = parseInt(b);
  return a - b;
});
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use('/user', require('./routes/api/auth'));
app.use('/seller', require('./routes/api/seller'));
app.use('/profile', require('./routes/api/profile'));
app.use('/api-docs', serve, setup);
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/seller'));
app.use('/', require('./routes/static'));
app.use('/', require('./routes/cart'));
app.use('/', require('./routes/food'));
app.use('/', require('./routes/order'));
app.use('/', require('./routes/review'));
app.use('/', require('./routes/shop'));
app.use('/', require('./routes/myprofile'));
app.use('/', require('./routes/home'));
app.use('/payment', require('./routes/razorpay'));

// Catch Error 404
app.use((req, res) => {
  res.status(404).render('404', { persist: req.persist });
});
app.listen(PORT, async () => {
  await connectDB();

  log.info(`http://localhost:${PORT}`);
});
