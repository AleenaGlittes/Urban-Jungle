const mongoose=require('mongoose')
const addressSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true,
    },
    LastName:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    State:{
        type:String,
        required:true,
    },
    Zipcode:{
        type:Number,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
    },
    landmark:{
        type:String,
        required:true,
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
      }
      
    
    
})
module.exports=mongoose.model("address",addressSchema)