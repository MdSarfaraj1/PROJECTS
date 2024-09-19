// here all rotes are beginnig with /listings though it is not wriiten but /listings will be added to all the routes present here in the beginnig whille the route object will be exported to app.js file

const express=require("express");
const router=express.Router();
const wrap=require("../utils/wrapAsync.js"); // taking the function for handling errors
const Listing=require("../models/listing.js"); // requiring Listing model
const Review=require("../models/reviews.js"); //  // requiring Review model
const MyError=require("../utils/Error_class.js");
const {joiListingSchemaValidation}=require("../joi_schema.js"); // taking the joi validation schema 

//Joi validation functions-----------------------------------------------
const validateListingSchema=(req,res,next)=>{
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

//----------------------------------------------

// print all listings------------------------------------------------------------------
router.get("/",wrap(async(req,res)=>{ //listings   // wrap is used to pass the error to error handling route
    console.log(req.params)
    let allListings=await Listing.find({});
    res.render("listings/alllistings.ejs",{allListings});
}));
//create new listings___________________________________________________________ 
router.get("/insert",(req,res)=>{  //    /listings/insert
    res.render("listings/new.ejs");
  
 });
 router.post("/insert",validateListingSchema,wrap(async(req,res,next)=>{    //   /listings/insert
            // let result=joiListingSchemaValidation.validate(req.body);  //checking that the incoming data validate the schema or not
            // if(result.error){
            //     throw new MyError(400,"This error is handled by joi");
            // }
    // the above is commented out because we have used validateListingSchema function as middleware to do the so
    let newL=new Listing(req.body);     
    console.log(req.body);
  await  newL.save();
    console.log(req.body);
    res.redirect("/listings");     
    }
 ))
//for individual listing's data-----------------------------------------------------
router.get("/:id",wrap(async(req,res)=>{
    let listings=await Listing.findById(req.params.id).populate("reviews");  // taking reviews via populate from  reviews collection
    res.render("listings/listings.ejs",{data:listings});
}));
 
//update listings______________________________________________________________________________
router.get("/:id/update",wrap(async(req,res)=>{
   let data=await Listing.findById(req.params.id);
   res.render("listings/update.ejs",{data});
}));
router.patch("/:id/update",validateListingSchema,async (req,res)=>{
    console.log(req.body);
 await Listing.findByIdAndUpdate(req.params.id,{$set:req.body});
   res.redirect("/listings");
});
//delete listing----------------------------------------------------------
router.get("/:id/delete",(req,res)=>{
    res.render("listings/delete.ejs",{id:req.params.id});
});
router.delete("/:id/delete",wrap(async(req,res)=>{
   await Listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
}));


module.exports=router;