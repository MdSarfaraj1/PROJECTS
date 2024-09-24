// here all rotes are beginnig with /listings though it is not wriiten but /listings will be added to all the routes present here in the beginnig whille the route object will be exported to app.js file

const express=require("express");
const router=express.Router();
const wrap=require("../utils/wrapAsync.js"); // taking the function for handling errors
const Review=require("../models/reviews.js"); //  // requiring Review model
const listingController=require("../CONTROLLERS/listings.js");
const {isLoggedIn, checkOwnershipOfListing,validateListingSchema}=require("../middleware.js");
//Joi validation functions-----------------------------------------------

router.get("/",wrap(listingController.index));
router.get("/insert",isLoggedIn,listingController.renderNewForm);
router.post("/insert",validateListingSchema,wrap(listingController.addNewListing))
//for individual listing's data-----------------------------------------------------
router.get("/:id",wrap(listingController.showListing));
//update listings______________________________________________________________________________
router.get("/:id/update",isLoggedIn,checkOwnershipOfListing,wrap(listingController.renderUpdateForm));
router.patch("/:id/update",isLoggedIn,checkOwnershipOfListing,validateListingSchema,listingController.update); 
//delete listing----------------------------------------------------------
router.get("/:id/delete",isLoggedIn,listingController.deleteForm);
router.delete("/:id/delete",isLoggedIn,checkOwnershipOfListing,wrap(listingController.delete));


module.exports=router;