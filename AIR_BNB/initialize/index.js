const mongoose=require("mongoose");
const indata=require("./data.js");
const Listing=require("../models/listing.js");
//------------------------------------------------------------------
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
const initialzeDb=async()=>{
    await Listing.deleteMany({});
  //  indata.data=indata.data.map((obj)=>({...obj, owner:"66f07281e2a582c2e7903066"}));// used for adding owner fill to the data
    await Listing.insertMany(indata.data); // accesseing the data key of the indata object
    console.log("db is inisialized");
};
initialzeDb();