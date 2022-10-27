const Food = require('../model/food');
const {storage} = require('../config/firebase')
const log = require('../log');
const uuidv4 = require('uuid/v4');
module.exports.addFood = async (req, res) => {
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
    res.status(201).json(food);
  } catch (err) {
    log.error(err);
    res.status(500).json({error: err.message});
  }
};

module.exports.getFoods = async (req, res) => {
  try {
    const foods = await Food.find({belongsTo: req.seller._id});
    res.status(200).json(foods);
  } catch (err) {
    log.error(err);
    res.status(500).json({error: err.message});
  }
};