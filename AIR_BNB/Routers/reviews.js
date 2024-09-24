//review routes------------------------------------------------------------------------
const express=require("express");
const router=express.Router({mergeParams:true});
// {mergeParams:true} helps to Preserve the req.params values from the parent router. If the parent and the child have 
//conflicting param names, the child’s value take precedence.
const wrap=require("../utils/wrapAsync.js");  // taking the function for handling errors
const reviewController=require("../CONTROLLERS/review.js");
const  {validateReviewSchema,isLoggedIn,checkOwnershipOfReview}=require("../middleware.js");

//---------------------------------------------------------------------
router.post("/",isLoggedIn,validateReviewSchema,wrap(reviewController.createReview));
  router.delete("/:reviewId",isLoggedIn,checkOwnershipOfReview,wrap(reviewController.deleteReview));
  module.exports=router; 