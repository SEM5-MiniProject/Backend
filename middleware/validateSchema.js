const { AnySchema } = require('yup');
const log = require('../log');

const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate(
      {
        body: req.body,
        params: req.params,
        query: req.query,
      },
    );
    next();
  } catch (err) {
    log.error(err);
    res.status(409).json({ error: err.message });
  }
};

module.exports = validateSchema;
