const mongoose = require('mongoose');

const checkMongoId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({error: 'Invalid ID'});
  }
  next();
};

module.exports = checkMongoId;