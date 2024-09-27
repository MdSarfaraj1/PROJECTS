const Listing=require("./models/listing");
const Review=require("./models/reviews.js");
const {joiListingSchemaValidation,joiReviewSchemaValidation}=require("./joi_schema.js"); // taking the joi validation schema 
// taking the joi validation schema 
// the above name should be use as same as the name while exporting
const MyError=require("./utils/Error_class.js");

module.exports.validateListingSchema=(req,res,next)=>{

    let {error}=joiListingSchemaValidation.validate(req.body);
    if(error){
        console.log("error")
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new MyError(400,errmsg);
    }
    else
    {
        console.log("no error") 
        next();
    }
   
};
module.exports.validateReviewSchema=(req,res,next)=>{
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

//----------------------------------------------

module.exports.isLoggedIn=(req,res,next)=>{  // this middle were will check if a user is logged in or not andd 
                                                // add redirectUrl variable inside req.session 
    if(!req.isAuthenticated()) // isuthenticate is provided by passport and implemented using req.user
    {
        req.session.redirectUrl=req.originalUrl;// adding a new variable inside the req.session that will contain from which route we came here
        req.flash("error","Please login first!"); 
        return res.redirect("/user/login");
    }
    next(); // calling next middleware present the route
}
//* When a user makes a request after logging in, 
    //Passport uses the deserializeUser function to fetch the full user data 
    //(like username, email, etc.) from the database using the stored user ID.
    //This allows the application to attach the user object to the req object as req.user.

module.exports.saveRedirectUrl=(req,res,next)=>{  // USED FOR SAVING PRIGINALURL BEFORE LOGIN
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    else
    res.locals.redirectUrl="/listings" // incase user directly log in
    next();
}

module.exports.checkOwnershipOfListing=async(req,res,next)=>{
    let listing=await Listing.findById(req.params.id);
    if(!listing.owner._id.equals(req.user._id))  // protecting while someone directly access the route
    {
        req.flash("error","you dont have permission")
        return res.redirect(`/listings/${req.params.id}`)
    }
    next();
} 
module.exports.checkOwnershipOfReview=async(req,res,next)=>{

    let review=await Review.findById(req.params.reviewId);
    if(!review.Rowner._id.equals(req.user._id))  // protecting while someone directly access the route
    {
        req.flash("error","you dont have permission")
        return res.redirect(`/listings/${req.params.id}`)
    }
    next();
} 