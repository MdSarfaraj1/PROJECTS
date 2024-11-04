const mongoose=require("mongoose");
const initialdata=require("./data.js");
const Listing=require("../models/listing.js");
const localMongo="mongodb://127.0.0.1:27017/airbnb";
const atlas="mongodb+srv://mdsarfaraj1:MDSARFARAJ@cluster0.3hksd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//------------------------------------------------------------------
async function main()
{
    await mongoose.connect(localMongo);
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
   initialdata.data=initialdata.data.map((obj)=>({...obj, owner:"66f07281e2a582c2e7903066",category:"pools"}));// used for adding owner fill to the data
    await Listing.insertMany(initialdata.data); // accesseing the data key of the indata object
    console.log("db is inisialized");
}; 
initialzeDb();