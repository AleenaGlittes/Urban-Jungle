const Wishlist = require('../model/wishlistModel'); 
const ProductModel = require('../model/productmodel');
const Address = require('../model/addressModel');

// 
const load_wishlist = async (req, res) => {
  try {
    const user = req.session.user_id;
    console.log(user);
    const userWishlist = await Wishlist.findOne({ user_id: user }).populate('products.product_id');
    console.log(userWishlist);
    if (userWishlist) {
      res.render('wishlist', { wishlist: userWishlist,user:user }); // Pass the userWishlist to the template
    } else {
      res.render('wishlist', { message: 'Wishlist is empty.',wishlist:userWishlist ,user:user});
    }
  } catch (error) {
    console.log(error.message);
    res.render('error', { error: 'An error occurred while loading the wishlist.' });
  }
};
const addtowishlist = async (req, res) => {
  try {
    const userId = req.session.user_id;
    console.log(userId);
    const product_id = req.query.id;
    console.log(product_id);
    const finduserinwishlist = await Wishlist.findOne({ user_id: userId });
    console.log(finduserinwishlist);
    if (finduserinwishlist) {
      const productindex = finduserinwishlist.products.findIndex((product) => {
        return (
          new String(product.product_id).trim() == new String(product_id).trim()
        );
      });
      if (productindex == -1) {
        const wish_data = await Wishlist.updateOne(
          { user_id: userId },
          { $push: { products: { product_id } } },
          { upsert: true }
        );
        res.send({
          success: true,
          msg: "product added to wishlist",
          data: wish_data,
        });
      } else {
        res.send({ message: "1" }); // already added the product in wishlist
      }
    } else {
      console.log("oooooooooooo");
      const updatewishlist = new Wishlist({
        user_id: userId,
        products: [{ product_id }],
      });
      console.log(updatewishlist);
      await updatewishlist.save();
      res.send({ mes: "added", data: updatewishlist });
    }
  } catch (error) {
    res.render('error', { error: error.message });

  }
};

const delete_wishlist = async (req, res) => {
  try {
    const userId = req.session.user_id;
    console.log(userId)
    const productid = req.query.id;
    console.log(productid)
    const wishitem = await Wishlist.findOne({ user_id: userId });
    console.log(wishitem)
    const productindex = wishitem.products.findIndex((product) => {
      return (
        new String(product.product_id).trim() == new String(productid).trim()
      );
    });
    if (productindex !== -1) {
      wishitem.products.splice(productindex, 1);
      await wishitem.save();
      res.send({ message: "1" });
    } else {
      res.send({ message: "0" });
    }
  } catch (error) {
    res.render('error', { error: error.message });

  }
};

module.exports = {
  load_wishlist,
  delete_wishlist,
  addtowishlist
};
