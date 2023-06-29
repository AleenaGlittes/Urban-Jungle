const collection = require("../model/userModel");
const otp = require('../model/otpmodel')
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer');
const product = require('../model/productmodel')
const address = require("../model/addressModel")
const order = require('../model/order')
const categorymodel=require('../model/categorymodel')
const Offers=require('../model/offerModel')
const walletModel=require('../model/walletModel');
const offerModel = require("../model/offerModel");



//-------- Home page rendering---------


const userPage = async (req, res) => {
  const productdata=await product.find({});
  const offerData=await Offers.find({});
  res.render("home", { user: req.session.user_id ,product:productdata,offer:offerData});
};


const userLogin = async (req, res) => {
  res.render("login", { message: "", user: req.session.user_id });
};


// ------Signup ppage rendering---------


const userSignup = (req, res) => {
  res.render("signup", {
    notice: "",
    user: req.session.user_id
  });
};

// --------LOADING ADMIN HOME-------


const userDashboard = async (req, res) => {
  const user = req.session.user_id;
  res.render("home", { user: user });
};


const verify = async (req, res) => {
  res.render("otp")
}

const cart = async (req, res) => {
  res.render("cart")
}

const profile = async (req, res) => {
  res.render("profile")
}

const userProfile = async (req, res) => {
  const user = await collection.findById(req.session.user_id);
  res.render("profile", { user: user });
};



// -----------Add new user to Database-----------------

const addnewuser = async (req, res) => {
  console.log('hi')
  console.log(req.body.name);
  const data = new collection({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    admin: 0,
  });
  await data.save();
  res.redirect("/");
};

//------------Login validation------------


const verifyLogin = async (req, res) => {
  try {
    const userDataFromUrl = await collection.findOne({ email: req.body.email });

    if (userDataFromUrl) {
      if (userDataFromUrl.block === 0) {
        if (userDataFromUrl.password === req.body.password) {
          req.session.user_id = userDataFromUrl._id;
          res.redirect("/home");
          console.log("login Successfull");
        } else {
          res.render("login", { message: "Password Incorrect" });
          console.log("wrong password");
        }
      } else {
        res.render("login", { message: "Account blocked" });
        console.log("wrong password");
      }
    } else {
      res.render("login", { message: "Username Incorrect" });
    }
  } catch (error) {
    res.render('error', { error: error.message });
  }
};

//---------- checking the user...---------

const checkUser = async (req, res) => {
  try {
    const checking = await collection.findOne({ email: req.body.email });
    console.log(checking)
    if (checking) {
      console.log(checking);
      res.render("signup", { notice: "Already registered" });
    } else {
      const data = new collection({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        admin: 0,
      });
      await data.save();

      res.render("login", { model: "1" });
    }
  } catch (error) {
    res.send(error.messsage);
  }
};

const logout = (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    res.render('error', { error: error.message });

  }
};

// ---------load otp page---------

const otp_page = async (req, res) => {
  try {
    const title = req.flash("title");
    res.render("loginOtp", { title: title[0] || "" });
  } catch (error) {
    res.render('error', { error: error.message });

  }
};
// otp sigin page need to check whether user is vaild or not (with email)

const opt_singIn = async (req, res) => {
  try {
    console.log(req.body.email);
    const userData = await collection.findOne({ email: req.body.email });
    console.log(userData);
    if (userData) {

      if (userData.block === 0) {
        const OTP = otpGenerator.generate(4, {
          digits: true,
          alphabets: false,
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
        console.log(OTP);
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "aleenavincent4u@gmail.com",
            pass: "rryxdacztzqlgjdh",
          },
        });
        var mailOptions = {
          from: "aleenavincent4u@gmail.com",
          to: userData.email,
          subject: "OTP VERIFICATION",
          text: "PLEASE ENTER THE OTP FOR LOGIN " + OTP,
        };
        transporter.sendMail(mailOptions, function (error, info) { });
        console.log(OTP);
        const Otp = new otp({ email: req.body.email, otp: OTP });
        const salt = await bcrypt.genSalt(10);
        Otp.otp = await bcrypt.hash(Otp.otp, salt);
        const result = await Otp.save();

        res.render("otp", { data: result });
      } else {
        // req.flash("title", "User is already exists");
        res.redirect("/loginOtp");
      }
    } else {
      req.flash("title", "User is not found");
      res.redirect("/loginOtp");
    }
  } catch (error) {
    console.log("otp error");
    res.render('error', { error: error.message });

  }
};


// ---------opt verification-------


const load_otpverifypage = async (req, res) => {
  try {
    const title = req.flash("title");
    res.render("otp", { title: title[0] || "" });
  } catch (error) {
    res.render('error', { error: error.message });

  }
};


// ---------------verifying otp----------


const 

otp_verify = async (req, res) => {
  try {
    const useremail = req.body.email;

    const userotp = req.body.otp;
    console.log(userotp);
    console.log(req.body.email);
    const otpHolder = await otp.findOne({ email: useremail });
    console.log(otpHolder);
    if (otpHolder) {
      const validuser = await bcrypt.compare(userotp, otpHolder.otp);

      if (validuser) {
        req.session.userid = req.body.email;
        res.render("home",{ user: req.session.userid});
      } else {
        console.log("otp wg");
        req.flash("title", "your otp is wrong");
        res.redirect("/loginOtp");
      }
    } else {
      console.log("expire");
      req.flash("title", "You used an Expried OTP");
      res.redirect("loginOtp");
    }
  } catch (error) {  
    res.render('error', { error: error.message });

    res.status(500).send({ message: "Server Error" });
  }
};

// ------loading the view product page------


const load_viewproduct = async (req, res) => {
  try {
    const productid = req.query.id;
    console.log("product id is " + productid);

    const data = await product.findById({ _id: productid });

    res.render("viewproduct", { data: data });
  } catch (error) {
    res.render('error', { error: error.message });
  }
};


const productsPerPage = 8; // Number of products to display per page

const productspage = async (req, res) => {
  try {
    console.log(req.session.user_id);
    const page = parseInt(req.query.page) || 1; // Get the current page from the query parameters
    const totalProducts = await product.countDocuments(); // Count the total number of products
    const category = await categorymodel.find({});
    const products = await product.find()
      .skip((page - 1) * productsPerPage)
      .limit(productsPerPage)
      .exec();
      
    const offers = await Offers.find(); // Retrieve all offers from the offer model

    res.render('product1', {
      model: '1',
      products: products,
      category: category,
      user: req.session.user_id,
      offers: offers,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / productsPerPage) // Calculate the total number of pages
    });
  } catch (error) {
    res.render('error', { error: error.message });
  }
}



// --------------Loading the profile--------------

const load_profile = async (req, res) => {
  const userid = req.session.user_id;
  console.log(userid);
  const userdata = await collection.findById(userid);
  console.log(userdata)
  const addresses = await address.find({userid:userid});
  console.log(addresses)


  const orderData = await order.find({ userId: userid }).populate('product.product_id');
  console.log(orderData)
  res.render('profile', { user: userdata, address: addresses, orders: orderData });
};

// ----------Adding address to the page--------

// ---------load address profile-------------



const load_address = async (req, res) => {
  console.log("JJJJJJJJJ");
  const user = req.session.user_id;
  console.log(user);
  const addresses = await address.find({ userid: user });
  console.log("address is", addresses);
  res.render('address', { address: addresses });
};



// -------------load order list--------------

const orderlist=async(req,res)=>{
  const user=req.session.user_id;
  const orderData = await order.find({ userId: user }).populate('product.product_id');
  // console.log(orderData)
  res.render('order',{orders:orderData,user:req.session.user_id})
}



// ------------------add address--------------------
const add_address = async (req, res) => {
  const userId = req.session.user_id;
  console.log(userId)
  try {
    const userdata = await address.findOne({ userid: userId });
    console.log(userdata)
    if (userdata) {
      const addressi = new address({
        userid: userId,
        Name: req.body.Name,
        LastName: req.body.LastName,
        address: req.body.address,
        city: req.body.city,
        State: req.body.State,
        landmark: req.body.landmark,
        Zipcode: req.body.Zipcode,
        phone: req.body.phone,
      });
      await addressi.save();
      res.status(200).redirect("/profile");
    } else {
      const addressi = new address({
        userid: req.session.user_id,
        Name: req.body.Name,
        LastName: req.body.LastName,
        address: req.body.address,
        city: req.body.city,
        State: req.body.State,
        landmark: req.body.landmark,
        Zipcode: req.body.Zipcode,
        phone: req.body.phone,
      });
      await addressi.save();
      res.status(200).redirect("/profile");
    }
  } catch (error) {
    res.render('error', { error: error.message });
  }
};

const forgotPage = async (req, res) => {
  try {
    res.render("forgotpassword");
  } catch (error) {
    res.render(("error"),error.messsage);
  }
}

const forgetPassword = async (req, res) => {
  try {
    const userData = await collection.findOne({ email: req.query.email });
    if (userData) {
      if (!userData.block) {
        const OTP = otpGenerator.generate(4, {
          digits: true,
          alphabets: false,
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
        console.log(OTP);
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "aleenavincent4u@gmail.com",
            pass: "rryxdacztzqlgjdh",
          },
        });
        let mailOptions = {
          from: "aleenavincent4u@gmail.com",
          to: userData.email,
          subject: "OTP VERIFICATION",
          text: "PLEASE ENTER THE OTP FOR LOGIN " + OTP,
        };
        transporter.sendMail(mailOptions, function (error, info) { });
        const Otp = new otp({
          email: req.query.email,
          otp: OTP,
        });
        const salt = await bcrypt.genSalt(10);
        Otp.otp = await bcrypt.hash(Otp.otp, salt);
        const result = await Otp.save();
        console.log('hi');
        res.send({ message: "1", status: "OTP Send" });
      } else {
        res.send({ message: "0", status: "Account Blocked" });
      }
    } else {
      res.send({ message: "0", status: "Incorrect Email" });
    }
  } catch (error) {
    res.render('error', { error: error.message });
  }
}

const verifyOTPFP = async (req, res) => {
  try {
    const userEmail = req.query.email;
    const userOtp = req.query.otp;
    const otpData = await otp.findOne({ email: userEmail });
    if (otpData) {
      const validUser = await bcrypt.compare(userOtp, otpData.otp);
      if (validUser) {
        const userData = await collection.findOne({
          email: otpData.email,
        });
        await otp.deleteOne({ email: otpData.email });
        res.send({ message: "1" });

      } else {
        res.send({ message: "0", status: "Incorrect OTP" });
      }
    } else {
      res.send({ message: "2", status: "OTP Expired" });
    }
  } catch (error) {
    res.render('error', { error: error.message });
  }
}

const resetPW = (req, res) => {
  try {
    res.render("resetPassword", { email: req.query.email });
  } catch (error) {
    res.render('error', { error: error.message });
  }
}

const resetPassword = async (req, res) => {
  try {
    let password = req.body.password;
    await collection.updateOne(
      { email: req.body.email },
      { $set: { password: password } }
    );
    res.redirect("/home");
  } catch (error) {
    res.render('error', { error: error.message });
  }
}


// -------------edit address---------

// -------------filteration--------------
const filter_product = async (req, res) => {
  try {
    const search = []
    search.push(...req.body.search);
    console.log(search);
    console.log("hlooo")

    const query = {};

    if (search.includes('Indoor Plants') || search.includes('Outdoor Plants')) {
      query.category = { $in: ['Indoor Plants', 'Outdoor Plants'] };
    }
    console.log('hiiiiii');
    console.log(query);
    let match;
    try {
      match = await product.find(query).populate('category_id').exec();
    } catch (error) {
      throw new Error('Error finding products: ' + error.message);
    }

    if (match.length > 0) {
      res.render('productpage', { product: match });
    } else {
      res.render('productpage', { product: [], message: 'No products found' });
    }
  } catch (error) {
    res.render('error', { error: error.message });
  }
};

// ------edit address

const edit_address = async (req, res) => {
  const userId = req.session.user_id;
  try {
    const userdata = await address.findOne({ userId: userId });
    if (userdata) {
      const address = new address({
        userid: userId,
        Name: req.body.Name,
        LastName: req.body.LastName,
        address: req.body.address,
        city: req.body.city,
        State: req.body.State,
        landmark: req.body.landmark,
        Zipcode: req.body.Zipcode,
        phone: req.body.phone,
       
      });
     await address.save();
      // res.status(200).send({success: true,msg:"address add",data: addaddress});
      res.status(200).redirect("/profile");
    } else {
      const address = new address({
        userid: userId,
        Name: req.body.Name,
        LastName: req.body.LastName,
        address: req.body.address,
        city: req.body.city,
        State: req.body.State,
        landmark: req.body.landmark,
        Zipcode: req.body.Zipcode,
        phone: req.body.phone,
      });
    await address.save();
      res.status(200).redirect("/profile");
    }
  } catch (error) {
    res.render('error', { error: error.message });
  }
};


// ------------delete address----------------

 const delete_address= async(req,res)=>{
  try{
      const id = req.query.id;
      console.log("id isssss"+id)
      await address.findByIdAndDelete(id)
      res.redirect('/profile');
  }catch(error){
    res.render('error', { error: error.message });
  }
}

const productsearch = async (req, res) => {
  try {
    const searchname = req.body.searchname.toLowerCase().trim();
    const usersession = req.session.user_id;

    const data = await collection.findOne({ email: usersession });
  
    const page = parseInt(req.query.page) || 1;
    const productsPerPage = 10; // Define the number of products to display per page
    const totalProducts = await product.countDocuments({ productname: { $regex: searchname, $options: 'i' } });
    const category = await categorymodel.find({});
    const offers = await offerModel.find({});
    const products = await product.aggregate([
      { $match: { productname: { $regex: searchname, $options: 'i' } } },
      { $skip: (page - 1) * productsPerPage },
      { $limit: productsPerPage }
    ]);

    if (products.length === 0) {
      res.render('product1', {
        model: '1',
        products: products,
        category: category,
        user: req.session.user_id,
        currentPage: page,
        offers: offers,
        totalPages: Math.ceil(totalProducts / productsPerPage)
      });
    } else {
      res.render('product1', {
        model: '1',
        products: products,
        category: category,
        user: req.session.user_id,
        currentPage: page,
        offers: offers,
        totalPages: Math.ceil(totalProducts / productsPerPage)
      });
    }
  } catch (error) {
    res.render('error', { error: error.message });
  }
};



const wallet_load=async(req,res)=>{
  try{
    const userid=req.session.user_id
    console.log(userid)
    const walletData=await walletModel.findOne({ userid: userid ,user: req.session.user_id })
    console.log(walletData)
     res.render("wallet",{wallet:walletData})

  }catch{
    res.render('error', { error: error.message });
  }

}









module.exports = {
  addnewuser,
  userLogin,
  userSignup,
  verifyLogin,
  userDashboard,
  logout,
  userPage,
  checkUser,
  verify,
  otp_page,
  opt_singIn,
  otp_verify,
  load_otpverifypage,
  productspage,
  load_viewproduct,
  cart,
  userProfile,
  load_profile,
  add_address,
  forgetPassword,
  verifyOTPFP,
  resetPW,
  resetPassword,
  forgotPage,
  filter_product,
  edit_address,
  delete_address,
  load_address  ,
  orderlist,
  productsearch,
  wallet_load


};
