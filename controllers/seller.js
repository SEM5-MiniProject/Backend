const Food = require('../model/food');

module.exports.addFood = async (req, res) => {
  try {
    const food = await Food.create({...req.body, belongsTo: req.seller});
    res.status(201).json({
      status: 'Food added successfully',
      food,
    });
  } catch (err) {
    res.status(400).json({
      status: 'Food not added',
      message: err.message,
    });
  }
}