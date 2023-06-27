const mongoose = require('mongoose');

const userInSchema = new mongoose.Schema({
  productname: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price:{
    type:Number,
    required:true
  },
  description: {
    type: String,
    required: true
  },
  offerprice:{
    type:Number,
    required:0
  },

 productimage: {
    type: Array,
    required: true,
    validate: [arrayLimit, "maximum 4 product images allowed"]
  }
});

function arrayLimit(val) {
  return val.length <= 4; 
}

module.exports= mongoose.model('products', userInSchema);


