const mongoose=require("mongoose");
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        // type:String,
        // set:(v)=>v===""?"https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp"
        //                 :v// if v is empty then dafault link else v's value
        filename:String,
        url:{
            type: String,
            default:"https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8OXx8fGVufDB8fHx8fA%3D%3D"
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
    }
});
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;