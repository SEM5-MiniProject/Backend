const yup = require('yup');

const addFoodSchema = yup.object({
  body: yup.object({
  name: yup.string().required(),
  price: yup.number().required(),
  description: yup.string().required(),
  category: yup.mixed().oneOf(['launch', 'dinner', 'breakfast', 'snacks']).required(),
  isVeg: yup.boolean().required(),
  isAvailable: yup.boolean().required(),
  }),
  file: yup.object({
    fieldname: yup.mixed().required(),
  }),
});

module.exports = {
  addFoodSchema,
};
