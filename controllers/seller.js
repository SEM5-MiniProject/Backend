const getDashbord = (req, res) => {
  res.render('dashbord', {
    persist: req.persist,
  });
};
const getMyProducts = (req, res) => {
  res.render('viewproduct', {
    persist: req.persist,
  });
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