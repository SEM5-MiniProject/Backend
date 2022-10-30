const yup = require('yup');
const cartSchema = yup.object({
    body : yup.object({
        food:yup.string().required(),
        quantity:yup.number().required()
    }) 
});

module.exports = cartSchema;