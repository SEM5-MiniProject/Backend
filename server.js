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
  console.log(arg1, arg2,options,(arg1 !== arg2));
  return (arg1 !== arg2) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('splitDate', function (title) {
  var t = title.toString().split("05");
  return t[0];
});
// convert date to javascript date in yyyy-mm-dd format
hbs.registerHelper('date', function (date) {
  var t = date.toString().split("05");
  var d = new Date(t[0]);
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var day = d.getDate().toString().length == 1 ? '0' + d.getDate() : d.getDate();
  return year + "-" + month + "-" + day;
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
const Food = require('./model/food');
app.get('/', async (req, res) => {
  const foodwithandwithoutoffer = await Food.aggregate([
    {
      $match: {
        isAvailable: true
      }
    },
    {
      $lookup: {
        from: 'offers',
        localField: '_id',
        foreignField: 'food',
        as: 'offer'
      }
    },
    {
      $lookup: {
        from: 'sellers',
        localField: 'belongsTo',
        foreignField: '_id',
        as: 'sellers'
      }
    },
    {
      $project: {
        name: 1,
        price: 1,
        image: 1,
        isVeg: 1,
        belongsTo: 1,
        seller: { $arrayElemAt: ['$sellers', 0] },
        offer: {
          $filter: {
            input: '$offer',
            as: 'offer',
            cond: {
              $gte: ['$$offer.validTill', new Date()]
            }
          }
        }
      }
    },
    {
      $project: {
        name: 1,
        price: 1,
        image: 1,
        isVeg: 1,
        seller: 1,
        belongsTo: 1,
        offer: {
          $arrayElemAt: ['$offer', 0]
        }
      }
    }
  ]);
  console.log(req.persist);
  res.render('index', {
    persist: req.persist,
    food: foodwithandwithoutoffer
  });
});

app.get('/checkout', (req, res) => {
  res.render('checkout', {
    persist: req.persist,
  });
});
app.get('/shop', (req, res) => {
  res.render('shop', { persist: req.persist })
})
// Catch Error 404
app.use((req, res) => {
  res.status(404).render('404', { persist: req.persist });
});
app.listen(PORT, async () => {
  await connectDB();

  log.info(`http://localhost:${PORT}`);
});
