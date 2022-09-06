const jwt = require('jsonwebtoken');

module.exports = {
    generateToken: (user) => {
        return jwt.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
    },
    verifyToken: (token) => {
        return jwt.verify(token, process.env.JWT_SECRET);
    },
    decodeToken: async (token) => {
        return await jwt.decode(token);
    },
}
