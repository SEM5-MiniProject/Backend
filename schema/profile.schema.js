const yup = require('yup');

const sellerProfileUpdateSchema = yup.object({
  body: yup.object({
    name: yup.string().required(),
    phoneNo: yup.number().required(),
    houseNo: yup.string().required(),
    sector: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    pincode: yup.number().required(),
  }),
})

module.exports = {
  sellerProfileUpdateSchema,
}