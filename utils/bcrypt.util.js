const bcrypt = require('bcrypt');


module.exports = {
    hashPassword: (password) => {
        return bcrypt.hashSync(password, 10);
    },
    comparePassword: (password, hash) => {
        return bcrypt.compareSync(password, hash);
    },
}