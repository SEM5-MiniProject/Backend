const User = require('../model/user');
const Seller = require('../model/seller');
const { verifyToken } = require('../utils/jwt.util');
const persistance = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      req.persist = false;
      return next();
    }
    const decoded = await verifyToken(token);
    if(decoded.user.role === 'user') {
      const user = await User.findById(decoded.user.id);
      if (!user) {
        req.persist = false;
      }
      req.persist = 'user';
      return next();
    }
    if(decoded.user.role === 'seller') {
      const seller = await Seller.findById(decoded.user.id);
      if (!seller) {
        req.persist = false;
      }
      req.persist = 'seller';
      return next();
    }
  } catch (err) {
    req.persist = false;
    return next();
  }
}
module.exports = persistance;