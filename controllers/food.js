const { default: mongoose } = require("mongoose");
const Food = require("../model/food");

const getFood = async (req, res) => {
  const { id } = req.params;
  const foodwithandwithoutoffer = await Food.aggregate([
    {
      $match: {
        isAvailable: true,
        _id: mongoose.Types.ObjectId(id)
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
        from:'carts',
        localField:'_id',
        foreignField:'food',
        as:'cart'
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
      $lookup:{
        from:'orders',
        localField:'_id',
        foreignField:'orderDetails.foodId',
        as:'order'
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
        order:{$arrayElemAt:['$order',0]},
        seller: { $arrayElemAt: ['$sellers', 0] },
        offer: {
          $filter: {
            input: '$offer',
            as: 'offer',
            cond: {
              $gte: ['$$offer.validTill', new Date()]
            }
          }
        },
        cart:{
          $filter:{
            input:'$cart',
            as:'cart',
            cond:{
              $eq:['$$cart.user',mongoose.Types.ObjectId(req.user._id)]
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
        category: 1,
        canReview:{
          $cond:{
            if:{
                $ne:['$order.orderStatus','cancelled'],
            },
            then:true,
            else:false
          }
        },
        offer: {
          $arrayElemAt: ['$offer', 0]
        },
        cart:{
          $arrayElemAt:['$cart',0]
        }
      }
    },
    {
      $lookup:{
        from:'ratings',
        localField:'_id',
        foreignField:'foodId',
        as:'review'
      }
    },
    {
      $project:{
        name:1,
        price:1,
        image:1,
        isVeg:1,
        seller:1,
        belongsTo:1,
        AllReviews:'$review',
        category:1,
        canReview:1,
        offer:1,
        cart:1,
        review:{
          $filter:{
            input:'$review',
            as:'review',
            cond:{
              $eq:['$$review.belongsTo',mongoose.Types.ObjectId(req.user._id)]
            }
          } 
        }
      }
    },
    {
      $project:{
        name:1,
        price:1,
        image:1,
        isVeg:1,
        seller:1,
        belongsTo:1,
        category:1,
        canReview:1,
        TotalReviews:{$size:'$AllReviews'},
        AllReviews:1,
        offer:1,
        cart:1,
        review:{
          $arrayElemAt:['$review',0]
        }
      }
    },
    // replce the all reviews belongs to with the user object
    {
      $lookup:{
        from:'users',
        localField:'AllReviews.belongsTo',
        foreignField:'_id',
        as:'AllReviewsbelongsTo'
      }
    },
    {
      $set:{
        AllReviews:{
          $map:{
            input:'$AllReviews',
            as:'review',
            in:{
              _id:'$$review._id',
              rating:'$$review.rating',
              comment :'$$review.comment',
              createdAt:'$$review.createdAt',
              belongsTo:{
                // search for the user object in the array of users
                $arrayElemAt:[
                  {
                    $filter:{
                      input:'$AllReviewsbelongsTo',
                      as:'user',
                      cond:{
                        $eq:['$$user._id','$$review.belongsTo']
                      }
                    }
                  },
                  0
                ]
              }
            }
          }
        }
      }
    },
    {
      $project:{
        name:1,
        price:1,
        image:1,
        isVeg:1,
        seller:1,
        belongsTo:1,
        category:1,
        canReview:1,
        TotalReviews:1,
        AllReviewsbelongsTo :1,
        offer:1,
        cart:1,
        review:1,
        AllReviews:1
      }
    }
  ]);
  console.log(foodwithandwithoutoffer[0].AllReviews);
  if (foodwithandwithoutoffer.length == 0) {
    req.flash('error', 'Cannot find that food!');
    return res.redirect('/dashboard');
  }
  res.render('showfood', {
    food:foodwithandwithoutoffer[0],
    persist: req.persist,
  });
};

module.exports = {
  getFood,
};