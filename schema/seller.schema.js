const yup = require('yup');

const sellerProofofIdentitySchema = yup.object({
  body: yup.object({
    proof: yup.string().required(),
  }),
});

module.exports = {
  sellerProofofIdentitySchema,
};
