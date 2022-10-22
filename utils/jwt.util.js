const jwt = require('jsonwebtoken');

module.exports = {
  generateToken: (user) => jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }),
  verifyToken: (token) => jwt.verify(token, process.env.JWT_SECRET),
  decodeToken: (token) => jwt.decode(token),
};
