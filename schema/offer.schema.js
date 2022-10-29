const yup = require('yup');
const { parseISO, isDate } = require('date-fns');
const foodOfferSchema = yup.object({
  body: yup.object({
    validTill: yup.date()
    .transform(function (value, originalValue) {
      if (this.isType(value)) {
        return value;
      }
      const result = parseISO(originalValue, "dd-MM-yyyy", "dd/MM/yyyy", "dd.MM.yyyy");
      console.log("sd ",isDate(originalValue));
      return result;
    })
    .typeError("please enter a valid date")
    .required()
    .min(new Date()),
    discount: yup.number().required(),
  }),
  params: yup.object({
    id: yup.string().required(),
  }),
});

module.exports = {
  foodOfferSchema,
};