module.exports=(fn)=>{
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err)); // can also be written as .catch(next)
        // means passed tha catched error into the next
    }
}
