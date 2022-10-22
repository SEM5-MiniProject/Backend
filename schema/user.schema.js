const yup = require('yup');

const userSignupSchema = yup.object({
  body: yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    phoneNo: yup.number().required(),
    houseNo: yup.string().required(),
    sector: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    pincode: yup.number().required(),
    isSeller: yup.boolean().required(),
  }),
});

const userLoginSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(),
    isSeller: yup.boolean().required(),
  }),
});

module.exports = {
  userSignupSchema,
  userLoginSchema,
};
