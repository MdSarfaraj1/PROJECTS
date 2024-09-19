// this is an excercise file for session
const express=require("express");
const app=express();
const session=require("express-session");
app.use(session({
        secret:"mysecret", // use to encrypt the session id cokie
        resave:false,  //This determines whether the session should be 
                        //saved back to the store, even if it wasn’t modified during the request.
        saveUninitialized:true, //Uninitialized session: A session is uninitialized when it’s created but
                        // has not been modified (e.g., the user hasn’t logged in yet).
    })
);
app.get("/test",(req,res)=>{
    res.send("test succesful");
})
app.get("/reqCount",(req,res)=>{
    if(req.session.count)  // req.session is javascript type object means new field can be added dynamically
        {
            req.session.count++;
        }else{
            req.session.count=1;
        }
res.send(`you send request ${req.session.count} times`);
})


app.listen(3000,()=>{
    console.log("app is running on port 3000");
})