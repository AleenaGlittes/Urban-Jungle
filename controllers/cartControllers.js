 const Cart = require("../model/cartModel");
const productmodel = require("../model/productmodel");
const address=require("../model/addressModel")
const collection=require("../model/userModel")
const couponModel=require("../model/couponModel")

const load_cart = async (req, res) => {
  try {
    const userid = req.session.user_id;
    const productid = req.query.id;

    console.log(userid);

    const cartData = await Cart.findOne({ userId: userid }).populate(
      "products.item"
    );
    console.log("cart data is:"+cartData)
    

    if (cartData) {
    
      res.render("cart", {cart: cartData, user: req.session.user_id });
    } else {
      res.render("cart", {
        user: req.session.user_id,
        message: "Cart is empty plz shop",
        cart: cartData,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

 
const addtoCart = async (req, res) => {
  
  const user = req.session.user_id;
  console.log("user id is"+user)
  const proId = req.query.id;
    let cart = await Cart.findOne({ userId: user });
  console.log(cart)
  if (cart) {
    const proExist = cart.products.findIndex(
      (product) => product.item.equals(proId)
    );
    if (proExist != -1) {
      let userid = new mongoose.Types.ObjectId(user);
      let proid = new mongoose.Types.ObjectId(proId);
      const products = await Cart.aggregate([
        { $match: { userid: userid } },
        { $group: { _id: "$products" } },
        { $unwind: "$_id" },
        { $match: { "_id.productid": proid } },
      ]);
      let qty = products[0]._id.quantity;
      if (qty < proqty) {
        await Cart.findOneAndUpdate(
          { userid: userData._id, "products.productid": proId },
          { $inc: { "products.$.quantity": 1 } },
          { new: true }
        );
      }else {
        flag = 1;
        req.flash("title", "Product Quantity limit exceeded");
        res.redirect(req.get("referer"));
      };
    } else {
      await Cart.findOneAndUpdate(
        { userId: user },
        { $push: { products: { item: proId, quantity: 1 } } },
        { new: true }
      );
    }
  } else {

    cart = new Cart({
      userId: user,
      products: [{ item: proId, quantity: 1 }],
    });
    await cart.save();
  }
};
// -----------------------REMOVE ITEM FROM THE CART---------------------



const removeItemFromCart = async (req, res) => {
  const user = req.session.user_id;
  console.log("user id is",user)
  const proId = req.query.id;
  console.log(proId)

  try { 
    const cart = await Cart.updateOne(
      { 'products.item': proId },
      { $pull: { products: { item: proId } } }
    );

    res.redirect('/cart')
    
  
  } catch (error) {
    console.log(error.message);
  }
};

// -------------incrementing cart quantity------------


const incrementProduct = async (req, res) => {
  try {
    const prodid = req.query.id;
    const value = req.query.val;
    const cartid = req.query.cartid;
    console.log("cart id is: " + cartid);
    console.log("value is: " + value);
    console.log("product id is: " + prodid);

    const incr = parseInt(value) + 1;
    console.log("incremented value is: " + incr);

    const checkQuantity = await productmodel.findById(prodid);
    console.log("product quantity is: " + checkQuantity.quantity);

    if (checkQuantity.quantity >= incr) {
      await Cart.updateOne(
        {
          _id: cartid,
          "products.item": prodid
        },
        {
          $inc: {
            "products.$.quantity": 1
          }
        }
      );

      console.log("Product incremented successfully.");
      res.send({ message: "1" });
    } else {
      console.log("Product quantity exceeds available stock.");
      res.send({ message: "0" });
    }
  } catch (error) {
    console.log(error.message);
    res.send({ message: "Error occurred." });
  }
};

// -------------Decrementing cart quantity-----------------

const decrementProduct = async (req, res) => {
  try {
    const prodid = req.query.id;
    const value = req.query.val;
    const cartid = req.query.cartid;
    console.log("cart id is: " + cartid);
    console.log("value is: " + value);
    console.log("product id is: " + prodid);

    const decr = parseInt(value) - 1;
    console.log("decremented value is: " + decr);

    const checkQuantity = await productmodel.findById(prodid);
    console.log("product quantity is: " + checkQuantity.quantity);

    if (decr >= 1) {
      await Cart.updateOne(
        {
          _id: cartid,
          "products.item": prodid
        },
        {
          $inc: {
            "products.$.quantity": -1
          }
        }
      );

      console.log("Product decremented successfully.");
      res.send({ message: "1" });
    } else {
      console.log("Product quantity cannot be less than 1.");
      res.send({ message: "0" });
    }
  } catch (error) {
    console.log(error.message);
    res.send({ message: "Error occurred." });
  }
};




const checkout = async (req, res) => {
  try {
    const userid = req.session.user_id;
    console.log("user id is: " + userid);
    const cart = await Cart.findOne({ userId: userid }).populate(
      "products.item"
    );
    console.log(cart)
    const address1 = await address.find({ userid: userid });
    console.log(address1)
    const coupons=await couponModel.find({});
    console.log(coupons)
    // res.render("checkout", { address: address1, cart: cart });
    res.render("checkout1", { address1: address1, cart: cart ,user:req.session.user_id,coupons:coupons});

  } catch (error) {
    console.log(error.message);
  }
};


const checkvalid_Coupon = async (req, res) => {
  try {
    let couponCode = req.body.code;
    console.log(couponCode)
    let user = req.session.user_id;
    let orderAmount = req.body.amount;
    const coupon = await couponModel.findOne({ couponCode: couponCode });
    if (coupon) {
      if (!coupon.usedUsers.includes(user)) {
        console.log("notuser")
        if (orderAmount >= coupon.minimumAmount) {
          console.log('success')
          res.send({ msg: "1", discount: coupon.couponAmount });
        } else {
          res.send({
            msg: "2",
            message: "Coupon is not applicable for this price",
          });
        }
      } else {
        res.send({ msg: "2", message: "Coupon already used" });
      }
    } else {
      res.send({ msg: "2", message: "Coupon Code Invalid" });
    }
    // console.log("kkkkkkk")
    // const couponCode = req.query.id;
    // const coupon = await couponModel.findOne({ couponName: couponCode });
    // if (coupon) {
    //   res.json({ message: "", coupon: coupon });
    // } else {

    //   res.send({ message: "Coupon code invalid" });
    // }
  } catch (error) {
      console.log('error',{error:error.message})
  }
};


module.exports = {
  load_cart,
  addtoCart,
  removeItemFromCart,
  incrementProduct,
  decrementProduct,
  checkout,
  checkvalid_Coupon 
};
