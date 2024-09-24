const Listing=require("../models/listing");

// print all listings------------------------------------------------------------------
module.exports.index=async(req,res)=>{ //listings   // wrap is used to pass the error to error handling route
    let allListings=await Listing.find({});
    res.render("listings/alllistings.ejs",{allListings});
}
//create new listings___________________________________________________________ 
module.exports.renderNewForm=(req,res)=>{  //    /listings/insert
    res.render("listings/new.ejs");}
module.exports.addNewListing=async(req,res,next)=>{    //   /listings/insert
    // let result=joiListingSchemaValidation.validate(req.body);  //checking that the incoming data validate the schema or not
    // if(result.error){
    //     throw new MyError(400,"This error is handled by joi");
    // }
// the above is commented out because we have used validateListingSchema function as middleware to do the so
let newL=new Listing(req.body);  
newL.owner=req.user._id;   // ADDING THE OWNER DETAILS
await  newL.save();
req.flash("success","New Listings Created");
res.redirect("/listings");     
}
//for individual listing's data-----------------------------------------------------
module.exports.showListing=async(req,res)=>{
    let listing=await Listing.findById(req.params.id)
    .populate({path:"reviews", //populate the reviews
      populate:{   //and inside the reviews populate the Rowner
        path:"Rowner",
    }
  }).populate("owner");  // taking reviews and owner via populate from  reviews and user collection
    console.log(listing);
    if(!listing)
   {
    req.flash("error","Invalid listing id message given by flash");
    res.redirect("/listings");
   }
   else
   {
     res.render("listings/listings.ejs",{data:listing});
     
   }
}
//update listings______________________________________________________________________________
module.exports.renderUpdateForm=async(req,res)=>{
    let data=await Listing.findById(req.params.id);
    if(!data) //protecting from api
     {
      req.flash("error","Invalid listing id message given by flash");
      res.redirect("/listings");
     }
     else
    res.render("listings/update.ejs",{data});
 }

 module.exports.update=async (req,res)=>{
    await Listing.findByIdAndUpdate(req.params.id,{$set:req.body});
    req.flash("success","listing updated");
      res.redirect(`/listings/${req.params.id}`);
   }
//delete listing --------------------------------------------------
   module.exports.deleteForm=(req,res)=>{
    res.render("listings/delete.ejs",{id:req.params.id});
    }
module.exports.delete=async(req,res)=>{
   await Listing.findByIdAndDelete(req.params.id);
   req.flash("success","Listing Deleted");
    res.redirect("/listings");
}