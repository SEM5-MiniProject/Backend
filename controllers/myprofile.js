const Seller = require('../model/seller');
const User = require('../model/user');

const getMyProfile = async (req, res) => {
  if (req.user && req.user.id) {
    const user = await User.findById(req.user.id);
    res.render('myprofile', { user: user, persist: req.persist });
  }
  if (req.seller && req.seller.id) {
    const seller = await Seller.findById(req.seller.id);
    res.render('myprofile', { user: seller, persist: req.persist });
  }
}
const postMyProfile = async (req, res) => {
  if (req.user && req.user.id) {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    return res.render('myprofile', { user: user, persist: req.persist });
  }
  if (req.seller && req.seller.id) {
    const seller = await Seller.findByIdAndUpdate(req.seller.id, req.body, { new: true });
    return res.render('myprofile', { user: seller, persist: req.persist });
  }
  res.redirect('/signin');
}

const getById = async (req, res) => {
  const user = await User.findById(req.params.id);
  const seller = await Seller.findById(req.params.id);
  return res.render('myprofile', { user: user ? user : seller, persist: req.persist, message: true });
}
module.exports = {
  getMyProfile,
  postMyProfile,
  getById
}