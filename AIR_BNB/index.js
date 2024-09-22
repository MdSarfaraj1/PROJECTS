// this is an excercise file for session and flash
const express=require("express");
const app=express();
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

const sessionOptions={
    secret:"mysecret", // use to encrypt the session id cokie
    resave:false,  //This determines whether the session should be 
                    //saved back to the store, even if it wasn’t modified during the request.
    saveUninitialized:true, //Uninitialized session: A session is uninitialized when it’s created but
                    // has not been modified (e.g., the user hasn’t logged in yet).
};
app.use(session(sessionOptions));// is a middleware setup for session management 
app.use(flash());
//===============================================================================
        // app.get("/reqCount",(req,res)=>{
        //     if(req.session.count)  // req.session is javascript type object means new field can be added dynamically
        //         {
        //             req.session.count++;
        //         }else{
        //             req.session.count=1;
        //         }
        // res.send(`you send request ${req.session.count} times`);
        // })
//=================================================================
app.get("/register",(req,res)=>{
    let {name="anynomus"}=req.query;
    req.session.name=name;
    req.flash("key","user register succesfully");
    req.flash("key2","just joking");
    res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
    res.locals.message=req.flash("key");// the same is been done here **
    //in the above line a new variable named message is attached with res.locals to give acces of its value to the views
 res.render("flash.ejs",{name:req.session.name,/* ** */msg:req.flash("key2")}); // key's value is been rendering as msg
})

app.listen(3000,()=>{
    console.log("app is running on port 3000");
})

//res.locals is an object in Express that is used to store variables
// that are scoped to a specific request. These variables are available
// to the view templates (e.g., EJS, Pug) when rendering a page, but 
//they are only valid for the lifetime of the request.