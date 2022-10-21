const User = require('../model/user');
const Seller = require('../model/seller');
const { comparePassword } = require('../utils/bcrypt.util');
const { generateToken } = require('../utils/jwt.util');
const userSignup = (req, res) => {
    try {
        if (req.body.isSeller) {
            const seller = new Seller(req.body);
            seller.save((err, seller) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                return res.status(200).json({
                    message: 'Seller created successfully',
                })
            });
        }
        else {

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
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        const seller = await Seller.findOne({ email }).select('+password');
        if (!req.body.isSeller && user) {
            console.log("User ", user);
            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid Credentials" });
            }
            const token = generateToken(user._id);
            return res.json({
                token,
                role: "user",
            });
        }
        else if (seller) {
            const isMatch = await comparePassword(password, seller.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid Credentials" });
            }
            const token = generateToken(seller._id)
            return res.json({
                token,
                role: "seller",
            });
        }
        else {
            return res.status(400).json({ error: "Something went wrong" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    userSignup,
    userLogin
}