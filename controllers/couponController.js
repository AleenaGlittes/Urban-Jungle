const couponModel=require('../model/couponModel')

 const listCoupon= async (req, res) => {
    try {
      let coupon = await couponModel.find({});
      res.render("couponList", { coupons: coupon });
    } catch (error) {
      res.render("error", { error: error.message });
    }
  }

   const addCouponPage= async (req, res) => {
    try {
      res.render("Coupon");
    } catch (error) {
      res.render("error", { error: error.message });
    }
  }

   const addCoupon=async (req, res) => {
    try {
      const coupon = new couponModel({
        couponCode: req.body.code,
        couponAmount: req.body.discountprice,
        expireDate: req.body.expiry,
        couponDescription: req.body.coupondescription,
        minimumAmount: req.body.min_purchase,
      });
      coupon.save();
      res.redirect("/admin/couponList");
    } catch (error) {
      res.render("error", { error: error.message });
    }
  }

 const  editCouponPage= async (req, res) => {
    try {
      const coupon = await couponModel.findOne({ _id: req.query.id });
      res.render("editCoupon", { coupon: coupon });
    } catch (error) {
      res.render("error", { error: error.message });
    }
  }

  const editCoupon = async (req, res) => {
    try {
      const coupon = await couponModel.updateOne(
        { _id: req.body.id },
        {
          $set: {
            couponCode: req.body.code,
            couponAmount: req.body.discountprice,
            expireDate: req.body.expiry,
            couponDescription: req.body.coupondescription,
            minimumAmount: req.body.min_purchase,
          },
        }
      );
      res.redirect("/admin/couponList");
    } catch (error) {
      res.render("error", { error: error.message });
    }
  }


//   -----delete coupon----------


const deletecoupon = async (req, res) => {
    try {
        const deleteid = req.query.id
        await couponModel.deleteOne({ _id:deleteid })
        res.redirect('/admin/couponList')

    } catch (error) {
      res.render('error', { error: error.message });
    }
}

  module.exports={
    listCoupon,
    addCouponPage,
    addCoupon,
    editCoupon,
    editCouponPage,
    deletecoupon
  }
