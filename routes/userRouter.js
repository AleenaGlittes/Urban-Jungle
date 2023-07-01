const express = require('express');
const user_router = express();
const path=require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const sharp=require('sharp')
const adminRouter=require('../routes/adminRoute')



const user_auth=require('../Authentication/userAuthetication')
const otp_auth=require('../Authentication/otpauth')
const collection=require('../model/userModel')

// ------------------CONTROLLERS-------------------


const userController =require('../controllers/userController')
const cartController=require('../controllers/cartControllers')
const orderController=require('../controllers/orderController')
const wishlistController=require('../controllers/wishlistControllers')


const nocache = require('nocache');
const nodemailer=require('nodemailer');
const flash = require('connect-flash');



// -----SESSION----------
 
user_router.use(session({
  secret:'secret',
  resave:false,
  saveUninitialized:true,
  }));

user_router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});




user_router.use(cookieParser());
user_router.use(express.static('public'))   ;

// ------------view Engine---------------

user_router.set('view engine', 'ejs');
user_router.set('views', './views/user');

// -------------middlewware for parsing incoming requests----------

user_router.use(express.json())
user_router.use(express.urlencoded({ extended: false }))
user_router.use(flash())

// ------------------USER LOGIN--------------

user_router.get('/',userController.userPage)
user_router.get('/login',user_auth.isLogout,userController.userLogin) 
user_router.post('/home',user_auth.isLogin,userController.userDashboard) 
user_router.post('/signup',userController.checkUser);
user_router.get('/signup', userController.userSignup)
user_router.get('/home',userController.userPage)  
user_router.post('/Userlogin',userController.verifyLogin)
user_router.get('/logout',userController.logout)

// ------OTP VERIFICATION---------------

user_router.get('/loginOtp',userController.otp_page)
user_router.post('/loginOtp',userController.opt_singIn);
user_router.get('/otp',userController.load_otpverifypage)
user_router.post('/otp',userController.otp_verify);

//---------- PRODUCT MANAGEMENT---------------

user_router.get('/products',userController.productspage)
user_router.get('/viewproduct',user_auth.isLogin,userController.load_viewproduct)
user_router.post('/search',userController.productsearch)
// ------------CART MANAGEMENT------------------


user_router.get('/cart',user_auth.isLogin,cartController.load_cart)
user_router.get('/addtocart',cartController.addtoCart)
user_router.get('/cartremove',cartController.removeItemFromCart)
user_router.get('/checkout',cartController.checkout)
user_router.get('/incrementproduct', cartController.incrementProduct)
user_router.get('/decrementproduct', cartController.decrementProduct)
user_router.post("/filterproduct",userController.filter_product)



// ----------PROFILE--------------

user_router.get('/profile',user_auth.isLogin,userController.load_profile)
user_router.post('/address_add',userController.add_address)
user_router.get('/editaddress',userController.edit_address)
user_router.get('/deleteaddress',userController.delete_address)
user_router.get('/address_profile',userController.load_address)
user_router.get('/order_list',userController.orderlist)




// -----------FORGOT PASSWORD----------

user_router.get("/forgotpassword", userController.forgotPage);
user_router.get("/frgtpswd", userController.forgetPassword);
user_router.get("/verifyOTPFP", userController.verifyOTPFP);
user_router.get("/resetPassword", userController.resetPW);
user_router.post("/resetPassword", userController.resetPassword);



// ---------ORDER MANAGEMENT------------------

user_router.post('/placeorder',orderController.place)
user_router.post('/cancelorder',orderController.cancel_order)
user_router.get('/orderDetails',orderController.orderDetails)
user_router.post('/razorpay',orderController.createOrder)
user_router.post('/returnorder',orderController.returnRequest)

// -------------WISH LIST-----------------------

user_router.get('/wishlist',user_auth.isLogin,wishlistController.load_wishlist)
user_router.get('/addtowhishlist',wishlistController.addtowishlist)
user_router.get('/deletewhishlistitem',wishlistController.delete_wishlist)
user_router.post('/checkvalidcoupon',cartController.checkvalid_Coupon)


// <---------------WALLET------------------->


user_router.get('/wallet',userController.wallet_load)
user_router.get('/error', (req, res) => {
  res.render('error');
});



// middleware of the routes to handle unhandled routes
user_router.use('/admin', adminRouter);
user_router.use((req, res, next) => {
    const error = new Error('Page not found');
    error.status = 404;
    next(error);
  });
  
  // Error handling middleware to display the error message
  user_router.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    res.status(status).render('error', { error: message });
  });

module.exports = user_router;

