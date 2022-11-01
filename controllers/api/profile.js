const Seller = require('../../model/seller');
const User = require('../../model/user');
module.exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(400).json({ message: 'Seller not found' });
    }
    res.status(200).json(seller);
  } catch (err) {
    res.status(400).json({ message: 'Bad request' });
  }
}
module.exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Bad request' });
  }
}
module.exports.getUserMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Bad request' });
  }
}
module.exports.getSellerMyProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller.id);
    if (!seller) {
      return res.status(400).json({ message: 'Seller not found' });
    }
    res.status(200).json(seller);
  } catch (err) {
    res.status(400).json({ message: 'Bad request' });
  }
}
module.exports.updateSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller.id);
    if (!seller) {
      return res.status(400).json({ message: 'Seller not found' });
    }
    seller.name = req.body.name;
    seller.phoneNo = req.body.phoneNo;
    seller.address = req.body.address;
    seller.city = req.body.city;
    seller.state = req.body.state;
    seller.country = req.body.country;
    seller.pincode = req.body.pincode;
    seller.save();
    res.status(200).json(seller);
  } catch (err) {
    res.status(400).json({ message: 'Bad request' });
  }
}
module.exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    user.name = req.body.name;
    user.phoneNo = req.body.phoneNo;
    user.address = req.body.address;
    user.city = req.body.city;
    user.state = req.body.state;
    user.country = req.body.country;
    user.pincode = req.body.pincode;
    user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Bad request' });
  }
}