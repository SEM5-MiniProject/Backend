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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const persistance = require('./middleware/checkPersistance');
app.use(persistance);
var hbs = require('hbs');
app.set('view engine', 'hbs');
app.use(express.static(path.resolve(__dirname, './static')))
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
app.use('/user', require('./routes/auth'));
app.use('/seller', require('./routes/seller'));
app.use('/profile', require('./routes/profile'));
app.use('/api-docs', serve, setup);
app.get('/', (req, res) => {
  res.render('index',{
    persist: req.persist,
  });
});
app.get('/signin', (req, res) => {
  res.render('signin');
});
app.get('/signup', (req, res) => {
  res.render('signup');
});
app.get('/test',(req,res)=>{
  res.render('test')
})
app.get('/myprofile',(req,res)=>{
  res.render('myprofile')
})
app.listen(PORT, async () => {
  await connectDB();

  log.info(`http://localhost:${PORT}`);
});
