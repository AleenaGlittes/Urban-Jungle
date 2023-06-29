const collection =require('../model/userModel')
const product=require('../model/productmodel')
const category=require('../model/categorymodel')
const order=require('../model/order')
const banner=require('../model/banner')
const offer=require('../model/offerModel')
const multer = require("multer")
const path = require("path")

// rendering og admin login
const adminHome=async(req,res)=>{
    res.render('login');
}
// rendeing of admindashboard
const adminLogin=async(req,res)=>{
  res.render('index')
 
}

// rendering of  home page of admin
// const Adminsignup=async(req,res)=>{

//     res.render('index')
// }

// rendering of product editing page 
const editproduct=async(req,res)=>{
    res.render('editproduct')
}

// rendering of products adding page


const addproduct=async(req,res)=>{
  const categories = await category.find({block:'List'})
res.render('addproduct', {categories:categories})
}

// Listing the user

const userslist=async(req,res)=>{
    try{
        const users=await collection.find({admin:{$ne:1}})
        res.render('userslist',{users:users})
    }catch(error){
        console.log(error.message)
    }

    
}


// -------------Updating the product----------

const productsPerPage = 10; // Number of products to display per page

const productlist = async (req, res) => {
  try {
    const currentPage = parseInt(req.query.page) || 1; // Get the current page from the query parameters
    const totalProducts = await product.countDocuments(); // Count the total number of products

    const products = await product
      .find()
      .skip((currentPage - 1) * productsPerPage)
      .limit(productsPerPage)
      .exec();

    const totalPages = Math.ceil(totalProducts / productsPerPage); // Calculate the total number of pages

    res.render('products', {
      model: '1',
      product: products,
      user: req.session.user_id,
      currentPage: currentPage,
      totalPages: totalPages
    });
  } catch (error) {
    console.log(error.message);
  }
};



const updatedata = async (req, res) => {
    try {
        const updateid = req.body.id;
        console.log(updateid);
        console.log(req.body.name,req.body.email);
        const updatedata = await product.updateOne({_id:updateid}, {$set:{productname: req.body.productname,brand: req.body.brand,price:req.body.price,description:req.body.description,productimage:req.body.productimage}})
        res.redirect('/admin/adminDashboard')
        console.log(updatedata);
    } catch (error) {
        console.log(error.messsage);
    }
}



const updateProduct = async (req, res) => {
    try {
        const userid = req.query.id;
        console.log(userid)
        const productdata = await product.findById({ _id:userid })
        console.log(productdata)
        res.render('editproduct', { productdata: productdata })

    } catch (error) {
        console.log(error.message);
    }
}


//--------------- Rendering admin Dashboared----------

const adminDashboard = async (req, res) => {
    try {
        const find = await collection.find({})
        const orderData = await order.find({}).populate("product.product_id").populate("userId");

        res.render('index', { find: find,orders:orderData })
        console.log("admin dashboard loaded")
    } catch (error) {
        res.send("error")
        console.log(error.message);
    }

}

// ---------validating the admin----------


const validateAdmin = async (req, res) => {
  try {
    const user = await collection.find({ admin: 0 });
    const admin = await collection.findOne({ admin: 1 });
    const orderData = await order.find({}).populate("product.product_id").populate("userId");

    if (req.body.name === admin.name && req.body.password === admin.password) {
      req.session.adminId = admin._id;

      res.render('index', { user: user, orders: orderData });
    } else {
      res.render("login", { message: "Incorrect password" });
    }
  } catch (error) {
    console.log(error.message);
  }
};


//------- destroying The session-------

const logout = async (req, res) => {
    try {
          req.session.destroy();
              res.redirect('/admin/adminlogin')

    } catch (error) {
        console.log(error.message);
    }
}


// ==========add product=========



const add_product = async (req, res) => {
  try {
      
    const croppedImages = [];
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        croppedImages.push(req.files[i].filename);
      }
    }


    const newproduct = new product({
      productname: req.body.productname,
      category:req.body.category,
      brand: req.body.brand,
      quantity:req.body.quantity,
      price: req.body.price,
      description: req.body.description,
      productimage:croppedImages,
    });

    console.log(newproduct)
console.log("newprodcut is "+newproduct)
    await newproduct.save();
    console.log('hi')

    // Send a success response
    res.status(200).redirect('/admin/products');
  } catch (error) {
    // Handle the error
    console.log(error.message)
    // res.status(500).send({ error: 'Internal Server Error' });
  }
};


//  ------------- deleting product----------



const update_product=async(req,res)=>{
  try {
    console.log('update_product');
    let dataobj;
    console.log(req.body);
    
    const arrImages = [];
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        arrImages[i] = req.files[i].filename;
      }
      dataobj = {
        productname: req.body.productname,
        category: req.body.category,
        brand: req.body.brand,
        quantity: req.body.quantity,
        price: req.body.price,
        description: req.body.description,
        productimage: arrImages,
      };
      
    } else {
 
      dataobj = {
        productname: req.body.productname,
        category: req.body.category,
        brand: req.body.brand,
        quantity: req.body.quantity,
        price: req.body.price,
        description: req.body.description,
      };
    }
    // console.log(dataobj);
     await product.findByIdAndUpdate(
      { _id: req.body.id },
      { $set: dataobj },
      { new: true }
    );
    
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ success: false, msg: error.message });
  }
}


const deleteproduct = async (req, res) => {
    try {
        const deleteid = req.query.id
        await product.deleteOne({ _id:deleteid })
        res.redirect('/admin/products')

    } catch (error) {
        console.log(error);
    }
}


 
   const truncateText= (text, limit) => {
    const words = text.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    }
    return text;
  }


// -----------listing category-------


 const add_category= async (req, res) => {
  try {
    let categoryName = req.body.categoryName;
    console.log(categoryName);
    let categorylower = categoryName.toLowerCase().replace(/\s/g, "");
    const existCategory = await category.findOne({
      categorylower: categorylower,
    });
    console.log(existCategory);
    if (existCategory) {
      req.flash("title", "Category Already Exist");
      res.redirect("/admin/Categories");
    } else {
      const newcategory = new category({
        categoryName: req.body.categoryName,
        categorylower: categorylower,
        CategoryDescription: req.body.CategoryDescription,
      });
      await newcategory.save();
      res.redirect("/admin/Categories");
    }
  } catch (error) {
    console.log(error.message);
  }
}

 const category_list=async (req, res) => {
  try {
    const title = req.flash("title");
    const categories = await category.find({});
    res.render("Categories", {
      category: categories,
      title: title[0],
    });
  } catch (error) {
    console.log(error.messsage);
  }
}

const categoriesList_Unlist = async (req, res) => {
 

  try {
    const id = req.body.categoryId
    console.log(id);
    const text = req.body.text
      // Update the document's status in the database
      const done = await category.findByIdAndUpdate({_id: id}, { $set: {block: text} });
      console.log("done" +done);
       if(done){
      res.send({message:"1",status: done})
       }else{
        res.send({message:"0"})
       }
      // res.status(200).json({ message: 'Status updated successfully' })
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating status' })
  }
}
  
  

//  block and unblock by the user


const block_user = async (req, res) => {
    try {
      const id = req.query.id;
  
      const user = await collection.findByIdAndUpdate(
        { _id: id },
        { $set: { block: true } }
      );
      if (user) {
        res.send({ message: "User blocked successfully" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const unblock_user = async (req, res) => {
    try {
      const id = req.query.id;
  
      const userData = await collection.findByIdAndUpdate(
        { _id: id },
        { $set: { block: false } }
      );
  
      if (userData) {
        res.send({ message: "User has been unblocked." });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  

 const fetchChartData = async (req,res)=> {

    try {
        const salesData = await order.aggregate([
            { $match: { status: 'Delivered' } },  { $group: { _id: { $dateToString: { format: '%Y-%m-%d',date: { $toDate: '$orderDate' } }},totalRevenue: { $sum: '$total' } }},
            {$sort: { _id: -1 }},{$project: { _id: 0, date: '$_id',totalRevenue: 1}},{$limit: 7}]);
    console.log(salesData);
            const productData = await order.aggregate([
            { $match: { status: 'Delivered' } },  { $group: { _id: { $dateToString: { format: '%Y-%m-%d',date: { $toDate: '$orderDate' } }},totalRevenue: { $sum: '$total' } }},
            {$sort: { _id: -1 }},{$project: { _id: 0, date: '$_id',totalRevenue: 1}},{$limit: 7}]);
    
          console.log(salesData);
    
          const data = [];
          const date = [];
        for (const totalRevenue of salesData) {
            data.push(totalRevenue.totalRevenue);
          }
        
            for (const item of salesData) {
            date.push(item.date);
          }
        
          
        

        res.status(200).send({ data:data, date:date })
  
    } catch (error) {
        console.log(error.message);
    }
    
  };

  const cartcount=async(req,res)=>{
    console.log('Accessed the /cart/count route');

  }

  const bannerload=async(req,res)=>{
    res.render('banner')
  }
  // const offerload=async(req,res)=>{
  //   res.render('offer')
  // }

  // const addoffer=async(req,res)=>{
  //   const productData = await product.find({})
  // res.render('offer', {product:productData})
  // }


  // adding Banner----------
  const add_banner = async (req, res) => {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/upload/banner'));
      },
      filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
      }
    });
  
    const upload = multer({ storage }).single("Image");
  
    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        req.session.message = {
          type: "error",
          message: "Failed to upload profile photo",
        };
        return res.redirect(302, "/profile-view"); // Use the correct order of arguments: status, url
      }
  
      console.log("Uploaded successfully");
  
      try {
        const newBanner = new banner({
          Name: req.body.Name,
          Description: req.body.Description,
          Image: req.file.filename,
        });
  
        await newBanner.save();
        console.log('Banner saved successfully');
  
        // Fetch the updated banner data
        const bannerData = await banner.find({});
  
        // Render the "bannerList" view with the updated banner data
        // res.render("bannerList", { banner: bannerData });
        res.status(200).redirect('/admin/bannerList');
      } catch (error) {
        // Handle the error
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  };
  
  
  


  const bannerList=async(req,res)=>{
    try{
      bannerData=await banner.find({})
      console.log(bannerData)
      res.render('bannerList',{banner:bannerData})

} catch (error) {
  console.log(error.message); // Log the error message to the console
  // res.status(500).send('Internal Server Error'); // Send an error response to the client
}

  }




   const load_offer=async(req,res)=>{
    try {
      const productData = await product.find({});
      console.log(productData)
      const offerData=await offer.find({}).populate("product");
      console.log("oopppasss")
      res.render('offer', {products:productData,offers:offerData });
      console.log("ppppp")
    } catch (error) {
      console.log(error.message);
    }

  }



  const add_offer = async (req, res) => {
    try {
      
      const { productName, offerPercentage } = req.body;
      console.log(productName);
      const productdetail = await product.findOne({ _id: productName });
      console.log(productdetail);
      const offerData = new offer({
        product: productName,
        offerPercentage: offerPercentage,
      });
  const offerprice = Math.floor(
    productdetail.price - (productdetail.price * offerPercentage) / 100
        );
        let pii=await product.updateOne(
          {_id: productName},
          { $set: { offerprice: offerprice } }
        );
        console.log(pii);
      await offerData.save();
  
      const products = await product.find({});
      const offers=await offer.find({}).populate("product");
  
      res.render('offer', { products: products,offers:offers});
    } catch (error) {
      console.log(error);
      
    }
  };

  const deleteoffer = async (req, res) => {
    try {
        const deleteid = req.query.id
        await offer.deleteOne({ _id:deleteid })
        res.redirect('/admin/offer')

    } catch (error) {
        console.log(error);
    }
}
  

module.exports={
    adminHome,
    adminLogin,
    editproduct,
    userslist,
    validateAdmin,
    adminDashboard,
    logout,
    addproduct,
    add_product,
    productlist,
    updateProduct,
    updatedata,
    deleteproduct,
    category_list,
    add_category,
    block_user,
    unblock_user,
    update_product ,
    truncateText,
    categoriesList_Unlist,
    fetchChartData,
    cartcount,
    bannerload,
    // addoffer,
    add_banner,
    bannerList, 
    load_offer,
    add_offer,
    deleteoffer
}

