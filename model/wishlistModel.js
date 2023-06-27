const mongoose=require('mongoose')


const wishListSchema= mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products:[
        {
            product_id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true
            }
        }
    ]
},

);
module.exports= mongoose.model('Wishlist',wishListSchema);