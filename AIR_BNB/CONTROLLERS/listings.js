const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken:mapToken});
// print all listings------------------------------------------------------------------
module.exports.index=async(req,res)=>{ //listings   // wrap is used to pass the error to error handling route
    let allListings=await Listing.find({});
    res.render("listings/alllistings.ejs",{allListings});
}
//create new listings___________________________________________________________ 
module.exports.renderNewForm=(req,res)=>{  //    /listings/insert
    res.render("listings/new.ejs");}

module.exports.addNewListing=async(req,res,next)=>{    //   /listings/insert
  console.log(req.body)
  let response=await geocodingClient.forwardGeocode({  //forwardgeocoding means address to coordinates
    query: req.body.location ,
    limit: 1
  })
  .send() //Without calling .send(), your request remains unexecuted. You’ve only set up what you want to do,
  // but .send() actually performs the operation, fetching the data you need.
 
let url=req.file.path;
let filename=req.file.filename;
let newL=new Listing(req.body);  
newL.image={filename,url};
newL.owner=req.user._id;   // ADDING THE OWNER DETAILS
newL.geometry=response.body.features[0].geometry; // adding the map coordinates
console.log(newL.geometry)
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
     {
      originalImage=data.image.url;
      originalImage.replace("/upload","/upload/w_200");// decreASING IMAGE QUALITY
       res.render("listings/update.ejs",{data,originalImage});
     }
   
 }

 module.exports.update=async (req,res)=>{
    let listing=await Listing.findByIdAndUpdate(req.params.id,{$set:req.body});
    if(req.file)
    {
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
   req.flash("success","listing updated");
      res.redirect(`/listings/${req.params.id}`);
   }
//delete listing --------------------------------------------------
   module.exports.deleteForm=(req,res)=>{
    res.render("listings/delete.ejs",{id:req.params.id});
    }
module.exports.destroy=async(req,res)=>{
   await Listing.findByIdAndDelete(req.params.id);
   req.flash("success","Listing Deleted");
    res.redirect("/listings");
}