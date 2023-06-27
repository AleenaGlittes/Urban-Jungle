const mongoose= require('mongoose');

const bannerSchema = mongoose.Schema({

Name:{
type:String,
required:true
},
Image:{
    type: String,
    required: true,
    
},
Description:{
    type:String,
    required:true
},
Status:{
    type: String,
    default:true
}

})


module.exports = mongoose.model("banner",bannerSchema)