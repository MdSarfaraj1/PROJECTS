const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js"); // listing model
const User=require("../models/user.js");
module.exports.createReview=async(req,res)=>{  // for creating reviews
    let id=req.params.id
    let newReview=new Review(req.body);
    newReview.Rowner=req.user._id;
      let listing=await Listing.findById(id);
      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
      req.flash("success","New review added");
      res.redirect(`/listings/${id}`);
    
  }

  module.exports.deleteReview=async(req,res)=>{ // for deleting the review
    let{id,reviewId}=req.params
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});  //pull the reviewId from reviews array
    let result=await Review.findByIdAndDelete(reviewId);
    console.log(result);
    req.flash("success","review deleted");
  res.redirect(`/listings/${id}`);
}