const { string, required } = require("joi");
const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");
const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true
    },

});  
userSchema.plugin(passportLocalMongoose);  // passportLocalMongoose autometically adds username and password in the schema
//also add some function with the schema  such as authenticate(), serializeUser(), deserializeUser(), and others.
const User=mongoose.model("User",userSchema);
module.exports=User;