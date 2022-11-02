const checkIfUser = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.status(401).json({
    error: 'Please authenticate',
  });
}
const checkIfSeller = (req, res, next) => {
  if (req.seller) {
    return next();
  }
  return res.status(401).json({
    error: 'Please authenticate',
  });
}
module.exports = {
  checkIfUser,
  checkIfSeller,
};