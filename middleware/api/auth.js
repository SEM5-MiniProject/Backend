const User = require('../../model/user');
const Seller = require('../../model/seller');
const { verifyToken } = require('../../utils/jwt.util');
const log = require('../../log');
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    log.info(token);
    if (!token) {
      return res.status(401).json({
        error: 'Please authenticate',
      });
    }
    const decoded = await verifyToken(token);
    log.info(decoded);
    if(decoded.user.role === 'user') {
      const user = await User.findById(decoded.user.id);
      if (!user) {
        return res.status(401).json({
          error: 'Please authenticate',
        });
      }
      req.user = user;
      return next();
    }
    if(decoded.user.role === 'seller') {
      const seller = await Seller.findById(decoded.user.id);
      if (!seller) {
        return res.status(401).json({
          error: 'Please authenticate',
        });
      }
      req.seller = seller;
      return next();
    }
    throw new Error('Invalid token');
  } catch (err) {
    log.error(err);
    return res.status(401).json({
      error: 'Please authenticate',
    });
  }
}

module.exports = auth;