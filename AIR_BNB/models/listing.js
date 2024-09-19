const mongoose=require("mongoose");
const Review=require("./reviews.js");
const listingSchema=new mongoose.Schema({
    
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image: {
        filename: { type: String },
        url: {
          type: String,
          set: (v) => v === "" ? "https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9kZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60" : v
        }
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
]
});
// adding a post middleware for deleting all the reviews if the listing is been deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;