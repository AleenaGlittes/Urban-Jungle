const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({

   categoryName:{
    type: String,
    required: true
   }, 
   CategoryDescription: {
    type: String,
    required: true
  },
  categorylower:{
    type:String,
    required:true
  },
  block:{
    type: String,
    required:true,
    default:"0"
  }

})

module.exports = mongoose.model("Category",categorySchema)