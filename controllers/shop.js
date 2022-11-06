const Food = require('../model/food');
const getShop = async (req, res) => {
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
        category: 1,
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
        category: 1,
        belongsTo: 1,
        offer: {
          $arrayElemAt: ['$offer', 0]
        }
      }
    },
    // group by category
    {
      $group: {
        _id: '$category',
        foods: {
          $push: {
            _id: '$_id',
            name: '$name',
            price: '$price',
            image: '$image',
            isVeg: '$isVeg',
            seller: '$seller',
            belongsTo: '$belongsTo',
            offer: '$offer'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        foods: 1
      }
    },
    // sort by category
    {
      $sort: {
        category: 1
      }
    }

  ]);
  const {category,veg,nonveg,price} = req.query;
  let food = foodwithandwithoutoffer;
  if (category) {
    food = food.filter((item) => item.category === category);
  }
  if (veg === 'true') {
    food = food.map((item) => {
      return {
        ...item,
        foods: item.foods.filter((food) => food.isVeg)
      };
    });
  }
  if (nonveg === 'true') {
    food = food.map((item) => {
      return {
        ...item,
        foods: item.foods.filter((food) => !food.isVeg)
      };
    });
  }
  if (price) {
    food = food.map((item) => {
      return {
        ...item,
        foods: item.foods.filter((food) => {
          if (food.offer) {
            return food.offer.newprice <= price;
          }
          return food.price <= price;
        })
      };
    });
  }

  res.render('shop', { persist: req.persist, food: food });
}

module.exports = {
  getShop
}