const express=require("express");
const router=express.Router();
const passport=require("passport");
const wrap=require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../CONTROLLERS/user.js");

//signup-----------------------------------------------
router.get("/signUp",userController.renderSignUpForm);
router.post("/signUp",wrap(userController.signUp));
//login-------------------------------------------------------------------
router.get("/login",userController.renderLogInForm);
router.post("/login",saveRedirectUrl, // passport automatically refresh the session after login so through this middleware we are checking
                                       // if there is a redirect url is present inside the current session and accessing it if so
passport.authenticate("local", {  // local refers to the local strategy means checking username and password only
   //successRedirect: "/listings",
   // successFlash: "Welcome back!",
   failureRedirect: "/user/login", // if authentication failed then redirect to /user/login
   failureFlash: "for using default messages just write true instead of this message",
   }),
wrap(userController.login));
//log out----------------------------------------------------------------------------------------
router.get("/logout",userController.logout)
module.exports=router; 