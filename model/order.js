const mongoose= require('mongoose');

 const orderSchema =   mongoose.Schema({

   userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user",
    requried: true
   },
   product :[{
    product_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"products",
        required: true
    },
    quantity:{
        type: Number,
        required:true
    }
    }],
    total:{
        type:Number,
        required:true
    },
  
    paymentmethod:{
     type:String,
     required:true
    },
   status:{
    type:String,
    default:"Pending"
   },  
   address:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"address",
    required: true
   },
orderDate:{
    type: Date,
    default: Date.now
},
paymentStatus:{
    type:String,
    default: "Unpaid"
}

 })
 module.exports = mongoose.model('order',orderSchema);