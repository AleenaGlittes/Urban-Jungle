const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
 
  products: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],


  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
