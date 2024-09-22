const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrap=require("../utils/wrapAsync.js");
const passport=require("passport");

//signup-----------------------------------------------
router.get("/signUp",async(req,res)=>{
res.render("users/signup.ejs");
});
router.post("/signUp",wrap(async(req,res)=>{
   try{
      let {username,email,password}=req.body;
      const newuser=new User({username,email}); // giving only email and userName as using passport-local
   let registerUser=await User.register(newuser,password); // registering the user in database using passport-local-mongoose
   console.log(registerUser);
   req.flash("success","You are logged in");
   res.redirect("/listings");
   }catch(err){

      req.flash("error",err.message);
      res.redirect("/user/signUp");
   }
}));
//login-------------------------------------------------------------------
router.get("/login",(req,res)=>{
   res.render("users/login.ejs"); // express by default finds in views
});
router.post("/login",
   passport.authenticate("local", {  // lacal refers to the local strategy means checking username and password only
      //successRedirect: "/listings",
      // successFlash: "Welcome back!",
      failureRedirect: "/user/login",
      failureFlash: "for using default messages just write true instead of this message",
    }),
   // if authentication failed then redirect to /user/login
       wrap(async(req,res)=>{
   try{
      let {username,password}=req.body;
      req.flash("success","you are succesfully logged in");
      res.redirect("/listings");
   }catch(err)
   {
      req.flash("error",err.message); // this will triggewred only if there any error occured inside try block
      res.redirect("/user/login");
   }
}));


module.exports=router; 