
const mongoose= require('mongoose');

const offerSchema = new mongoose.Schema({
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true
    },
    offerPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 50
    },
   
  });
  
 
module.exports= mongoose.model('offer',offerSchema );
  