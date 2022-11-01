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
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false,limit: '50mb' }));
app.use(cookieParser());
const persistance = require('./middleware/checkPersistance');
app.use(persistance);
const hbs = require('hbs');
const auth = require('./middleware/auth');
const User = require('./model/user');
const Seller = require('./model/seller');
const flash = require('express-flash');
const session = require('express-session');
app.set('view engine', 'hbs');
app.use(express.static(path.resolve(__dirname, './static')))
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
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
app.use('/',require('./routes/auth'));
app.use('/',require('./routes/seller'));
app.get('/', (req, res) => {
  res.render('index',{
    persist: req.persist,
  });
});
app.get('/cart', (req, res) => {
  res.render('cart',{
    persist: req.persist,
  });
});
app.get('/checkout', (req, res) => {
  res.render('checkout',{
    persist: req.persist,
  });
});
app.get('/myprofile',auth,async (req,res)=>{
  if (req.user && req.user.id){
    const user = await User.findById(req.user.id);
    console.log(user);
    res.render('myprofile',{user:user,persist: req.persist});
  }
  if (req.seller && req.seller.id){
    const seller = await Seller.findById(req.seller.id);
    res.render('myprofile',{user:seller,persist: req.persist});
  }
})
app.get('/shop',(req,res)=>{
  res.render('shop',{persist: req.persist})
})
app.listen(PORT, async () => {
  await connectDB();

  log.info(`http://localhost:${PORT}`);
});
