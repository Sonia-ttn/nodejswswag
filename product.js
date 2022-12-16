const  mongoose  = require("mongoose")

require("./config")
const schema=new mongoose.Schema({
    name:String,
    brand:String,
    price:Number,
    category:String
})
module.exports=mongoose.model('products',schema)
