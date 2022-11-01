const log = require("../log");
const Food = require("../model/food");

const getDashbord = (req, res) => {
  res.render('dashbord', {
    persist: req.persist,
  });
};
const getMyProducts = async(req, res) => {
  try {
    const foods = await Food.find({belongsTo: req.seller._id});
    res.render('viewproduct', {
      persist: req.persist,
      foods: foods,
    });
  } catch (err) {
    log.error(err);
    res.redirect('/dashboard');
  }
};
const getAddProduct = (req, res) => {
  res.render('addproduct', {
    persist: req.persist,
  });
};
module.exports = {
  getDashbord,
  getMyProducts,
  getAddProduct,
};