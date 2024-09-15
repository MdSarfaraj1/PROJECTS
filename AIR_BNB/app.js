const express=require("express");
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");  //  "./" refers to the current directory
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const wrap=require("./utils/wrapAsync.js"); // taking the function for handling errors
const MyError=require("./utils/Error_class.js");
const joiSchemaValidation=require("./joi_schema.js"); // taking the joi validation schema 
const app=express();
const port=8080;
const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.engine("ejs",ejsMate);
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
//------------------------------------------------------------------
async function main() 
{
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}
main()
.then(()=>{  
    console.log("connection established");
})
.catch(()=>{
    console.log("connection failed");
})
//-----------------------------------------------
app.get("/",(req,res)=>{
    res.send("hi i am groot");
})
// print all listings------------------------------------------------------------------
app.get("/listings",wrap(async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/alllistings.ejs",{allListings});
}));
//create new listings___________________________________________________________
app.get("/listing/insert",(req,res)=>{
    res.render("listings/new.ejs");
  
 });
 app.post("/listings/insert",wrap(async(req,res,next)=>{
  let result=joiSchemaValidation.validate(req.body);  // validating that the incoming data validate the schema or not
  if(result.error){
    throw new Error(400,"This error is handled by joi");
  }
    let newL=new Listing(req.body);     
  await  newL.save();
    console.log(req.body);
    res.redirect("/listings");     
    }
 ))
//for individual listing's data-----------------------------------------------------
app.get("/listings/:id",wrap(async(req,res)=>{
    let listings=await Listing.findById(req.params.id);
    res.render("listings/listings.ejs",{data:listings});
}));
 
//update listings______________________________________________________________________________
app.get("/listings/:id/update",wrap(async(req,res)=>{
   let data=await Listing.findById(req.params.id);
   res.render("listings/update.ejs",{data});
}));
app.patch("/listings/:id/update",async (req,res)=>{
    
 await Listing.findByIdAndUpdate(req.params.id,{$set:req.body.listings});
   res.redirect("/listings");
});
//delete listing----------------------------------------------------------
app.get("/listings/:id/delete",(req,res)=>{
    res.render("listings/delete.ejs",{id:req.params.id});
});
app.delete("/listings/:id/delete",wrap(async(req,res)=>{
   await Listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
}));
//__________________________________________________________________________________________________________
app.all("*",(req,res,next)=>{ // if non of the above route matches then this route will play 
    next(new MyError(400,"page not found"));
})
//middleware for error handling
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
res.status(statusCode).render("error.ejs",{message});
})

app.listen(port,()=>{
    console.log("listing on port 8080");
})  