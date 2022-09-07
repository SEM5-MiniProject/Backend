const { AnySchema } = require('yup');

const validateSchema = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.validate(
                {
                    body: req.body,
                    params: req.params,
                    query: req.query
                }
            );
            next();
        } catch (err) {
            console.log(err);
            res.status(409).json({ error: err.message });
        }
    }
}

module.exports = validateSchema;