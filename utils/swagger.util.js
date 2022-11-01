const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Meal Diaries API',
      version: '1.0.0',
      description: 'Meal Diaries API',
      contact: {
        name: 'Salman Adhikari',
        email: 'salmanad5s3@gmail.com',
      },
    },
  },
  apis: ['./routes/api/*.js', './model/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
const setup = swaggerUI.setup(swaggerDocs);
const serve = swaggerUI.serve;
module.exports = {
  serve,
  setup,
};
