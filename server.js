const mongoose = require("mongoose")
require("dotenv").config()
mongoose.connect(process.env.dbconnect, { useNewUrlParser: true })
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log("failed to connect");
    })


const express = require('express');
const app = express();
const path = require('path');
// user Router
const userRouter = require('./routes/userRouter')
const adminRouter = require('./routes/adminRoute');



app.use('/', userRouter);
app.use('/admin', adminRouter);



app.listen(3003, () => {
    console.log("server Started");
})