const express=require("express");
const mongoose=require("mongoose");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const MyError=require("./utils/Error_class.js");
const listingsRouter=require("./Routers/listings.js"); // requiring the router object for /listings path
const reviewRouter=require("./Routers/reviews.js");
const userRouter=require("./Routers/user.js");
const session=require("express-session");
const flash=require("connect-flash");  // for creating flash messages
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
const app=express();
const port=8080;
const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.engine("ejs",ejsMate);
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

//database connction==========================================================================================
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
//-------------------------------------------------------------
const sessionOptions={  //for session
    secret:"mysecret", // use to encrypt the session id coockie
    resave:false,  //This determines whether the session should be 
                    //saved back to the store, even if it wasn’t modified during the request.
    saveUninitialized:true, //Uninitialized session: A session is uninitialized when it’s created but
                    // has not been modified (e.g., the user hasn’t logged in yet).
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:1000*60*60*24*7 // expiry date
    }
};
//========================================================================================================

app.use(session(sessionOptions));  //you’re telling the app, “Use the session system!” The sessionOptions would be how long the pass is
                                  // valid and how secure it should be
app.use(flash());//This line allows your app to create one-time messages

//----------------------------------------------------------------------------

app.use(passport.initialize());//This command tells Passport to start up and be ready to check user
// credentials, like usernames and passwords. But Passport also needs to keep track 
//of which user is logged in, which is what the next line does:

app.use(passport.session());//This line links Passport with the session system, allowing Passport to know who’s logged in

//But how does Passport know whether a user is really who they say they are? 
//That’s where a strategy comes in. In this case, you're using a local strategy,
// which means you’ll be checking usernames and passwords stored in your database.
passport.use(new localStrategy(User.authenticate()));  //User.authenticate() handles the logic for authenticating users,
// like checking if the username and password match the database records.
//Here, Passport is told: “Hey, use this method (User.authenticate()) to check usernames and passwords 
//when someone tries to log in.” It will search the User model for the right credentials.

passport.serializeUser(User.serializeUser());
//This line says, “Take this user and give them a unique identifier (like an ID number) that I can
// use in their session.” It simplifies storing the user’s information in the session.

passport.deserializeUser(User.deserializeUser());//It tells Passport how to take the saved user ID 
//from the session and fetch the full user details from the database.
//It says, “When you see this ID badge, pull up the full user details again from the database.”
//----------------------------------------------------------------------------------------------


// middleware to attache flash messages
app.use((req,res,next)=>{ 
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error"); 
    next();
});
//the above is for session and flash -------------------------------------------------------------------

app.get("/",(req,res)=>{
    res.send("hi i am groot");
});
            // app.get("/demoUser",async(req,res)=>{ // practising 
            //     let newUser=new User({
            //         email:"md97@gmail.com",
            //         username:"Md Sarfaraj"
            //     });
            // let newuseregisterred=await User.register(newUser,"typeThePasswordHere"); 
            // res.send(newuseregisterred);
            // })
app.use("/listings/:id/review",reviewRouter);  // the params dont go to the router means req.param will be {} in the reviewRouter object
app.use("/listings",listingsRouter); 
app.use("/user",userRouter);
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