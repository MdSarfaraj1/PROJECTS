const joi=require("joi");
module.exports.Joischema=joi.object({
    title:joi.string().required(),
    description:joi.string().required(),
    location:joi.string().required(),
    country:joi.string().required(),
    price:joi.number().min(0).required(),

})
// the schema validation can be checked using the html by providing the desired attributes inside the tag 
// but if request is send to the server directly via any api say hoppscotch then joi will check the validations before doing 
// further processes