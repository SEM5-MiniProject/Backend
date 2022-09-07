const User = require('../model/user');

const UserSignup = (req, res) => {
    try {
        console.log("Controller ",req.body);
        const user = new User(req.body);
        user.save((err, user) => {
            if (err) {
                return res.status(400).json({
                    error: err.message
                });
            }
            return res.status(200).json({
                message: "Signup successfully"
            });
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}



module.exports = {
    UserSignup
}