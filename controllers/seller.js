const { storage } = require("../config/firebase");
const log = require("../log");
const Food = require("../model/food");
const Offer = require("../model/offer");
const uuidv4 = require('uuid/v4');

const getDashbord = async (req, res) => {
  const foodwithandwithoutoffer = await Food.aggregate([
    {
      $match: {
        isAvailable: true
      }
    },
    {
      $lookup: {
        from: 'offers',
        localField: '_id',
        foreignField: 'food',
        as: 'offer'
      }
    },
    {
      $lookup: {
        from: 'sellers',
        localField: 'belongsTo',
        foreignField: '_id',
        as: 'sellers'
      }
    },
    {
      $project: {
        name: 1,
        price: 1,
        image: 1,
        isVeg: 1,
        belongsTo: 1,
        seller: { $arrayElemAt: ['$sellers', 0] },
        offer: {
          $filter: {
            input: '$offer',
            as: 'offer',
            cond: {
              $gte: ['$$offer.validTill', new Date()]
            }
          }
        }
      }
    },
    {
      $project: {
        name: 1,
        price: 1,
        image: 1,
        isVeg: 1,
        seller: 1,
        belongsTo: 1,
        offer: {
          $arrayElemAt: ['$offer', 0]
        }
      }
    }
  ]);
  // console.log(foodwithandwithoutoffer);
  res.render('index', {
    persist: req.persist,
    food: foodwithandwithoutoffer,
  });
};
const getMyProducts = async(req, res) => {
  try {
    // category the food into offer and non offer
    const foodswithandwithoutoffer = await Food.aggregate([
      {
        $match: {
          belongsTo: req.seller._id,
        },
      },
      {
        $lookup: {
          from: 'offers',
          localField: '_id',
          foreignField: 'food',
          as: 'offer',
        },
      },
      {
        $project: {
          name: 1,
          price: 1,
          image: 1,
          isVeg: 1,
          isAvailable: 1,
          description:1,
          category:1,
          offer: {
            $arrayElemAt: ['$offer', 0],
          },
        },
      },
      {
        $sort: {
          'offer.createdAt': -1,
        },
      }
    ]);
    // const foodswithoffer = foodswithandwithoutoffer.filter(food => food.offer);
    // const foodswithoutoffer = foodswithandwithoutoffer.filter(food => !food.offer);
    res.render('viewproduct', {
      persist: req.persist,
      foods:foodswithandwithoutoffer
    });
    // const foods = await Food.find({belongsTo: req.seller._id});
    // res.render('viewproduct', {
    //   persist: req.persist,
    //   foods: foods,
    // });
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
const postEditProduct = async(req, res) => {
  try {
    const food = await Food.findOne({_id: req.params.id, belongsTo: req.seller._id});
    if (!food) {
      return res.status(404).json({error: 'Food not found'});
    }
    if (req.file && req.file.originalname !== food.image.split('/o/')[1].split('?')[0]) {
      log.info('Image updated');
      const bucket = storage.bucket();
      // const file = bucket.file(food.image.split('/o/')[1].split('?')[0]);
      // await file.delete();
      const newFile = await bucket.upload(req.file.path, {
        destination: uuidv4() + req.file.originalname,
        metadata: {
          contentType: req.file.mimetype,
          metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
          },
        },
      })
      const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(newFile[0].name)}?alt=media&token=${newFile[0].metadata.metadata.firebaseStorageDownloadTokens}`;
      req.body.image = url;
    }
    else {
      log.info('Image not updated');
    }
    await Food.findOneAndUpdate({_id: req.params.id, belongsTo: req.seller._id}, {...req.body,isVeg: req.body.isVeg? true :false,isAvailable:req.body.isAvailable?true:false}, {new: true});
    req.flash('success', 'Product updated successfully');
    res.redirect('/myproducts');
  } catch (err) {
    log.error(err);
    res.status(500).json({error: err.message});
  }
};
const postAddOffer = async(req, res) => {
  try {
    const food = await Food.findOne({_id: req.params.id, belongsTo: req.seller._id});
    if (!food) {
      return res.status(404).json({error: 'Food not found'});
    }
    const offer = new Offer({
      ...req.body,
      belongsTo: food._id,
      food: req.params.id,
    });
    await offer.save();
    req.flash('success', 'Offer added successfully');
    res.redirect('/myproducts');
  } catch (err) {
    log.error(err);
    res.status(500).json({error: err.message});
  }
};
const postEditOffer = async(req, res) => {
  try {
    const food = await Food.findOne({_id: req.params.id, belongsTo: req.seller._id});
    if (!food) {
      return res.status(404).json({error: 'Food not found'});
    }
    await Offer.findOneAndUpdate({food: req.params.id}, {...req.body}, {new: true});
    req.flash('success', 'Offer updated successfully');
    res.redirect('/myproducts');
  } catch (err) {
    log.error(err);
    res.status(500).json({error: err.message});
  }
};
const getDeleteOffer = async(req, res) => {
  try {
    const food = await Food.findOne({_id: req.params.id, belongsTo: req.seller._id});
    if (!food) {
      return res.status(404).json({error: 'Food not found'});
    }
    await Offer.findOneAndDelete({food: req.params.id});
    req.flash('success', 'Offer deleted successfully');
    res.redirect('/myproducts');
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
  postEditProduct,
  postAddOffer,
  postEditOffer,
  getDeleteOffer
};