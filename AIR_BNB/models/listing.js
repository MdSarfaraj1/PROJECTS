const mongoose=require("mongoose");
const Review=require("./reviews.js");
const { string } = require("joi");
const listingSchema=new mongoose.Schema({
    
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:['pools','lakes','houseboats','trendings','mansions','hills','arctics','campings','apartments']
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
    },
    geometry:{
        type:
        {
            type:String,
        enum:['Point'],
        required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
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