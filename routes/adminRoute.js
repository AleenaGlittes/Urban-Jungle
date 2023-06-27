const express = require('express');
const admin_router = express();
const path = require('path');
const multer = require('multer')
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const nocache = require('nocache');
// const jspdf=require('jspdf')
const adminControllers = require('../controllers/adminControllers')
const admin_auth = require('../Authentication/Adminauthentication')
const orderController = require('../controllers/orderController')
const salesController = require('../controllers/salesController')
const couponcontroller = require('../controllers/couponController')


const couponControllers = require('../controllers/couponController')
const fs = require('fs')


admin_router.use(express.static('public'));

admin_router.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));

admin_router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

admin_router.use(bodyParser.json({ limit: '10mb' }));

admin_router.use(express.urlencoded({ limit: '10mb', extended: false }))

// -------------view Engine------------

admin_router.set('view engine', 'ejs');
admin_router.set('views', './views/Admin');






const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/upload'));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  }
});

// Create multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 10 * 1024 * 1024,
  },
});

// --------------------USER----------------


admin_router.get('/', admin_auth.isLogout, adminControllers.adminHome)

admin_router.get('/adminLogin', adminControllers.adminLogin)
admin_router.post('/adminLogin', adminControllers.validateAdmin)
admin_router.get('/userslist', adminControllers.userslist)
admin_router.get('/products', adminControllers.productlist)
// admin_router.get('/block',adminControllers.blockUser) 
admin_router.post("/block-user", adminControllers.block_user);
admin_router.post('/unblock-user', adminControllers.unblock_user);




//---------------------PRODUCT-------------

admin_router.get('/addproduct', adminControllers.addproduct)
admin_router.post('/addproduct', upload.array('productimage', 5), adminControllers.add_product)
admin_router.get('/adminDashboard', adminControllers.adminDashboard)
admin_router.get('/editproduct', adminControllers.updateProduct)
admin_router.post('/editproductdetails', upload.array('productImage'), adminControllers.update_product)
admin_router.get('/delete', adminControllers.deleteproduct)
// admin_router.get('/Categories',adminControllers.Category) 


// ----------------CATEGORY---------------------

admin_router.get('/Categories', adminControllers.category_list);
admin_router.post('/addcategory', adminControllers.add_category);
admin_router.post('/listandunlist', adminControllers.categoriesList_Unlist)



// ---------------ORDER LISTING-------------


admin_router.get('/order', orderController.load_order)
admin_router.get('/orderdetails', orderController.order_details);
admin_router.post('/statusupdate', orderController.status_update)
admin_router.post('/returnapprove', orderController.approveReturn);
admin_router.post('/returnapprove', orderController.status_update)


// -------------COUPON MANAGEMENT------------------

admin_router.get('/couponList', couponControllers.listCoupon)
admin_router.get('/addcoupon', couponControllers.addCouponPage)
admin_router.post('/addcoupon', couponControllers.addCoupon)
admin_router.get('/editcouponPage', couponControllers.editCouponPage)
admin_router.post('/editcoupon', couponControllers.editCoupon)
admin_router.get('/deletecoupon', couponControllers.deletecoupon)



// --------------SALES REPORT--------------------

admin_router.get('/salesReport', salesController.salesReport)
admin_router.get('/chartData', adminControllers.fetchChartData)
admin_router.get('/cart/count', adminControllers.cartcount)


// -------------BANNER MANAGEMENT-------------

admin_router.get('/banner', adminControllers.bannerload)
admin_router.post('/addbanner', adminControllers.add_banner)
admin_router.get('/bannerList', adminControllers.bannerList)


// -------------OFFER MANAGEMENT----------------

admin_router.get('/offer', adminControllers.load_offer)
admin_router.post('/addoffer', adminControllers.add_offer)
admin_router.get('/deleteoffer', adminControllers.deleteoffer)


module.exports = admin_router;

