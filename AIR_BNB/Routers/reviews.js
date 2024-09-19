//review routes------------------------------------------------------------------------
const express=require("express");
const router=express.Router({mergeParams:true});
// {mergeParams:true} helps to Preserve the req.params values from the parent router. If the parent and the child have 
//conflicting param names, the child’s value take precedence.
const Review=require("../models/reviews.js");
const wrap=require("../utils/wrapAsync.js");  // taking the function for handling errors
const Listing=require("../models/listing.js"); // listing model
const MyError=require("../utils/Error_class.js");
const {joiReviewSchemaValidation}=require("../joi_schema.js");// taking the joi validation schema 
// the above name should be use as same as the name while exporting
const validateReviewSchema=(req,res,next)=>{
    let {error}=joiReviewSchemaValidation.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        console.log("ERROR");
        throw new MyError(400,errmsg);
        
    }
    else
    {
        console.log("NO ERROR"); 
        next();
    }
   
};
//---------------------------------------------------------------------
router.post("/",validateReviewSchema,wrap(async(req,res)=>{  // for creating reviews
    let id=req.params.id
    let newReview=new Review(req.body);
      let listing=await Listing.findById(id);
      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
      res.redirect(`/listings/${id}`);
    
  }));
  router.delete("/:reviewId",wrap(async(req,res)=>{ // for deleting the review
      let{id,reviewId}=req.params
      console.log(req.body);
     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});  //pull the reviewId from reviews array
      let result=await Review.findByIdAndDelete(reviewId);
      console.log(result);
    res.redirect(`/listings/${id}`);
  }));
  module.exports=router; 