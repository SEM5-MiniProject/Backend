const yup = require('yup');

const foodSchema = yup.object({
    name: yup.string().required(),
    price: yup.number().required(),
    description: yup.string().required(),
    category: yup.string().required(),
    image: yup.string().required(),
    isVeg: yup.boolean().required(),
    isAvailable: yup.boolean().required(),
    belongsTo: yup.string().required(),
})

module.exports = {
    foodSchema
}