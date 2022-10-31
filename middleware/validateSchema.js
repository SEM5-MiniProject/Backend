const log = require('../log');

const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate(
      {
        body: req.body,
        params: req.params,
        query: req.query,
        file: req.file,
      },
    );
    next();
  } catch (err) {
    console.log(req.body)
    log.error(err);
    res.status(409).json({ error: err.message });
  }
};

module.exports = validateSchema;
