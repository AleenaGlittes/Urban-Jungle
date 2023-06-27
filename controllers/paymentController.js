const order=require('../model/order')



 const razorpayInstance = new Razorpay({
    key_id: 'rzp_test_jKTP9O29mdQ840',
    key_secret: 'QRba1uOg2yeEztPRrijqeIGx',
  })
  



   const createOrder= async (req, res) => {
    try {
      const amount = req.body.amount * 100;
      const options = {
        amount: amount,
        currency: 'INR',
        receipt: 'Receipt no.'

      }
      razopayInstance.order.create(options),
        (err, orde) => {
          if (!err) {
            res.status(200).send({
              success: true,
              msg: 'Order Created',
              order_id: order.id,
              amount: total,
              key_id: RAZORPAY_ID_KEY,
              description: req.body.name,
              description: req.body.description,
              contact: "9876543210",

            });
          }else{
            res.status(400).send({success:false,msg:'Something went wrong!'})
          }
        }
    }catch{

    }
  }

  module.exports={

  }




