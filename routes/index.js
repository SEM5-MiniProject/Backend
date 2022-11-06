const { serve, setup } = require('../utils/swagger.util');

const initRouters = (app) => {
  app.use('/user', require('./api/auth'));
  app.use('/seller', require('./api/seller'));
  app.use('/profile', require('./api/profile'));
  app.use('/api-docs', serve, setup);
  app.use('/', require('./auth'));
  app.use('/', require('./seller'));
  app.use('/', require('./static'));
  app.use('/', require('./cart'));
  app.use('/', require('./food'));
  app.use('/', require('./order'));
  app.use('/', require('./review'));
  app.use('/', require('./shop'));
  app.use('/', require('./myprofile'));
  app.use('/', require('./home'));
  app.use('/payment', require('./razorpay'));
  
  // Catch Error 404
  app.use((req, res) => {
    res.status(404).render('404', { persist: req.persist });
  });
  
}

module.exports = initRouters;