const express=require("express");
const mongoose=require("mongoose");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const MyError=require("./utils/Error_class.js");
const listingsRouter=require("./Routers/listings.js"); // requiring the router object for /listings path
const reviewRouter=require("./Routers/reviews.js")
const app=express();
const port=8080;
const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.engine("ejs",ejsMate);
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

//==========================================================================================
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
//========================================================================================================

app.get("/",(req,res)=>{
    res.send("hi i am groot");
});

app.use("/listings/:id/review",reviewRouter);  // the params dont go to the router means req.param will be {} in the reviewRouter object
app.use("/listings",listingsRouter); 
//because of this above line all the request coming to the route beginnig with /listings will check for his path into the request object

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