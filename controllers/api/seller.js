const Food = require('../../model/food');
const Offer = require('../../model/offer');
const {storage} = require('../../config/firebase')
const log = require('../../log');
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

module.exports.getFood = async (req, res) => {
  try {
    const food = await Food.findOne({_id: req.params.id, belongsTo: req.seller._id});
    if (!food) {
      return res.status(404).json({error: 'Food not found'});
    }
    res.status(200).json(food);
  } catch (err) {
    log.error(err);
    res.status(500).json({error: err.message});
  }
};

module.exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findOneAndDelete({_id: req.params.id, belongsTo: req.seller._id});
    if (!food) {
      return res.status(404).json({error: 'Food not found'});
    }
    const bucket = storage.bucket();
    const file = bucket.file(food.image.split('/o/')[1].split('?')[0]);
    await file.delete();
    res.status(200).json(food);
  } catch (err) {
    log.error(err);
    res.status(500).json({error: err.message});
  }
};
module.exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findOne({_id: req.params.id, belongsTo: req.seller._id});
    if (!food) {
      return res.status(404).json({error: 'Food not found'});
    }
    if (req.file.originalname !== food.image.split('/o/')[1].split('?')[0]) {
      log.info('Image updated');
      const bucket = storage.bucket();
      const file = bucket.file(food.image.split('/o/')[1].split('?')[0]);
      await file.delete();
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
    const updatedFood = await Food.findOneAndUpdate({_id: req.params.id, belongsTo: req.seller._id}, req.body, {new: true});
    res.status(200).json(updatedFood);
  } catch (err) {
    log.error(err);
    res.status(500).json({error: err.message});
  }
};
module.exports.addOffer = async (req, res) => {
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
    res.status(201).json(offer);
  } catch (err) {
    log.error(err);
    res.status(500).json({error: err.message});
  }
}

module.exports.getOffer = async (req, res) => {
  try {
    const food = await Food.findOne({_id: req.params.id, belongsTo: req.seller._id});
    if (!food) {
      return res.status(404).json({error: 'Food not found'});
    }
    const offer = await Offer.findOne({food: food._id});
    if (!offer) {
      return res.status(404).json({error: 'Offer not found'});
    }
    res.status(200).json(offer);
  } catch (err) {
    log.error(err);
    res.status(500).json({error: err.message});
  }
}
module.exports.updateOffer = async (req, res) => {
  try {
    const food = await Food.findOne({_id: req.params.id, belongsTo: req.seller._id});
    if (!food) {
      return res.status(404).json({error: 'Food not found'});
    }
    const offer = await Offer.findOneAndUpdate({food: food._id}, req.body, {new: true});
    res.status(200).json(offer);
  } catch (err) {
    log.error(err);
    res.status(500).json({error: err.message});
  }
}
module.exports.deleteOffer = async (req, res) => {
  try {
    const food = await Food.findOne({_id: req.params.id, belongsTo: req.seller._id});
    if (!food) {
      return res.status(404).json({error: 'Food not found'});
    }
    const offer = await Offer.findOneAndDelete({food: food._id});
    res.status(200).json(offer);
  } catch (err) {
    log.error(err);
    res.status(500).json({error: err.message});
  }
}
module.exports.getAllOffers = async (req, res) => {
  try {
    const Foods = await Food.find({belongsTo: req.seller._id});
    log.info(Foods.map(food => food._id));
    const offers = await Offer.find({food: {$in: Foods.map(food => food._id)}});
    res.status(200).json(offers);
  } catch (err) {
    log.error(err);
    res.status(500).json({error: err.message});
  }
}