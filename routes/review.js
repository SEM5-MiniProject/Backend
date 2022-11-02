const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { checkIfUser } = require('../middleware/requiredUser');
const Review = require('../model/rating');
const checkMongoId = require('../middleware/mongooseId');
router.post('/review/add/:id',auth,checkIfUser,checkMongoId,async (req,res)=>{
  const {rating,comment} = req.body;
  const foodId = req.params.id;
  const userId = req.user._id;
  // check if the user has already reviewed the food
  const review = await Review.findOne({foodId,userId});
  if(review){
    review.rating = rating;
    review.comment = comment;
    await review.save();
    req.flash('success','Review updated successfully');
    return res.redirect(`/food/${foodId}`);
  }
  else{
    const newreview = new Review({
      rating,
      comment,
      foodId,
      belongsTo:userId
    });
    await newreview.save();
  }
  res.redirect('/food/'+foodId);
});
router.post('/review/delete/:id',auth,checkIfUser,checkMongoId,async (req,res)=>{
  const {id} = req.params;
  const userId = req.user._id;
  const review = await Review.findOne({_id:id,belongsTo:userId});
  if(!review){
    req.flash('error','Cannot find that review');
    return res.redirect('/dashboard');
  }
  const delReview = await Review.findByIdAndDelete(id);
  req.flash('success','Review deleted successfully');
  res.redirect('/food/'+delReview.foodId);
});
module.exports = router;