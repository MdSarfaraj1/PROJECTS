
const User=require("../models/user");

//signup-----------------------------------------------
module.exports.renderSignUpForm=async(req,res)=>{
    res.render("users/signup.ejs");
    }
module.exports.signUp=async(req,res)=>{
    try{
       let {username,email,password}=req.body;
       const newuser=new User({username,email}); // giving only email and userName as using passport-local
    let registerUser=await User.register(newuser,password); // registering the user in database using passport-local-mongoose
    console.log(registerUser);
    req.login(registerUser,(err)=>{ // if we not use this user will not autometically logged in just after sign up
       if(err)
         return next(err); 
    req.flash("success","You are logged in");
    res.redirect("/listings");
    })
    }catch(err){
 
       req.flash("error",err.message);
       res.redirect("/user/signUp");
    }
 }
 //login-------------------------------------------------------------------
 module.exports.renderLogInForm=(req,res)=>{
    res.render("users/login.ejs"); // express by default finds in views
 }

 module.exports.login=async(req,res)=>{
 try{
    let {username,password}=req.body;
    req.flash("success","you are succesfully logged in");
    res.redirect(res.locals.redirectUrl); //see middleware.js
 }catch(err)
 {
    req.flash("error",err.message); // this will triggewred only if there any error occured inside try block
    res.redirect("/user/login");
 }
}

//log out----------------------------------------------------------------------------------------
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{ // taking a callback , if any error ocurred go to the error handling middleware
       if(err)
          next(err);
       req.flash("success","You are succesfully logged out");
       res.redirect("/listings");
    })
 }