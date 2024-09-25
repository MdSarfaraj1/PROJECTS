const mongoose=require("mongoose");
const Review=require("./reviews.js");
const { string } = require("joi");
const listingSchema=new mongoose.Schema({
    
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image: {
        filename: String,
        url: String
      },
    price:{
        type:Number,
        min:1
    },
    location:String,
     mapOfString: {
            type: Map,
            of: String
          },
    country:{
        type:String,
        required:true
    },
    reviews:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});
// adding a post middleware for deleting all the reviews if the listing is been deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;