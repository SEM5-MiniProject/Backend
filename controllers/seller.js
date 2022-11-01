const { storage } = require("../config/firebase");
const log = require("../log");
const Food = require("../model/food");
const uuidv4 = require('uuid/v4');

const getDashbord = (req, res) => {
  res.render('index', {
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
const postAddProduct = async(req, res) => {
  try {
    const bucket = storage.bucket();
    const file = await bucket.upload(req.file.path, {
      destination: uuidv4() + req.file.originalname,
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
    })
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file[0].name)}?alt=media&token=${file[0].metadata.metadata.firebaseStorageDownloadTokens}`;
    const food = new Food({
      ...req.body,
      image: url,
      belongsTo: req.seller._id,
    });
    await food.save();
    req.flash('success', 'Product added successfully');
    res.redirect('/dashboard');
  } catch (err) {
    log.error(err);
    res.status(500).json({error: err.message});
  }
};

module.exports = {
  getDashbord,
  getMyProducts,
  getAddProduct,
  postAddProduct,
};