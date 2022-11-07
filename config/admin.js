const AdminJS = require('adminjs');
const AdminJSMongoose = require('@adminjs/mongoose');
const mongoose = require('mongoose');

AdminJS.registerAdapter(AdminJSMongoose);
const models = require('../model');

const adminJs = new AdminJS({
  databases: [mongoose],
  rootPath: '/admin',
  resources: models.model,
  branding: {
    companyName: 'MealDiaries',
    softwareBrothers: false,
    logo:'https://mealdiaries.herokuapp.com/assets/img/logo.png',
    favicon:'https://mealdiaries.herokuapp.com/assets/img/logo.png',
    withMadeWithLove:false,
  },
});
module.exports = adminJs;
