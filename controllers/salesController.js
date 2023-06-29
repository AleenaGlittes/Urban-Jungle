const order=require('../model/order')
const jspdf=require('jspdf')
const xlsx=require('xlsx')


 const salesReport= async (req, res) => {
    
    try {

      const order_details = await order.find({})
      .populate("userId")
      .populate("product.product_id")
      .exec();
      order_details.forEach(function(order) { 
         order.product.forEach(function(products){ 
      

            console.log(products. product_id.productname);

        })
    })


      res.render("salesReport", { orders: order_details });
    } catch (error) {
     
      res.render('error', { error: error.message })
    }
  }

  module.exports={
    salesReport
  }