// here all rotes are beginnig with /listings though it is not wriiten but /listings will be added to all the routes present here in the beginnig whille the route object will be exported to app.js file

const express=require("express");
const router=express.Router();
const wrap=require("../utils/wrapAsync.js"); // taking the function for handling errors
const Review=require("../models/reviews.js"); //  // requiring Review model
const listingController=require("../CONTROLLERS/listings.js");
const {isLoggedIn, checkOwnershipOfListing,validateListingSchema}=require("../middleware.js");
//Joi validation functions-----------------------------------------------
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
        //const upload = multer({ dest: 'uploads/' }) // will store data in 
        //Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
        //NOTE: Multer will not process any form which is not multipart (multipart/form-data).
const upload = multer({storage});

router.get("/",wrap(listingController.index));

router.route("/insert")
.get(isLoggedIn,listingController.renderNewForm)
.post(isLoggedIn,upload.single('image[url]'),validateListingSchema,wrap(listingController.addNewListing))
//upload.single('image[url]') must come first because it handles the file upload and processes multipart/form-data,
// which means it extracts the file and form data(other normal fields) from the request. Without it, the rest of the middleware, like validation,
// won't have access to the file and form data in req.file and req.body

//for individual listing's data-----------------------------------------------------
router.get("/:id",wrap(listingController.showListing));

//update listings______________________________________________________________________________
router.route("/:id/update")
.get(isLoggedIn,checkOwnershipOfListing,wrap(listingController.renderUpdateForm))
.patch(isLoggedIn,checkOwnershipOfListing,upload.single('image[url]'),validateListingSchema,listingController.update); 

//delete listing----------------------------------------------------------
router.route("/:id/delete")
.get(isLoggedIn,listingController.deleteForm)
.delete(isLoggedIn,checkOwnershipOfListing,wrap(listingController.destroy));


module.exports=router;