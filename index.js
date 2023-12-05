const express = require('express');
const mongoose = require('mongoose');
const multer = require("multer");
const path = require('path');
const adminRoute = require('./route/adminRoute');
const adminServiceRoute = require('./route/adminServiceRoute');
const subscriptionRoute = require('./route/subscriptionRoute');
const faqRoute = require('./route/faqRoute');
const bannerRoute = require('./route/bannerRoute');
const termsConditionRoute = require('./route/termsConditionRoute');
const privacyPolicyRoute = require('./route/privecyPolicyRoute');
const authRoute = require('./route/authRoute');
const userRoute = require('./route/userRoute');
const contactRoute = require('./route/contactRoute');
const vendorAuth = require('./route/vendorAuthRoute');
const vendorManagementRoute = require('./route/vendorManagementRoute');
const userManagementRoute = require('./route/userManagementRoute');
const vendorRoute = require('./route/vendorRoute');
const dashbordRoute = require('./route/dashbordRoute');
const notificationRoute = require('./route/notificationRoute');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*'
}));

const URL = "mongodb+srv://yogesh_beldar:Oh9CU4nZCayFGTeC@cluster0.zveoo.mongodb.net/OSS_Application";

const connectDb = async () =>{
    try {
        await mongoose.connect(URL)
        console.log('mongoDb is connected..!')
    } catch (error) {
        console.log(error);
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = file.originalname.split(".").pop();
      cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
    },
  });
  
  const upload = multer({ storage: storage });
  app.use(upload.any());
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  
  app.use((error, req, res, next) => {
    const message = `this is the Unexpected field --> ${error.field}`;
    return res.status(500).send(message);
  });

app.use('/', adminRoute);
app.use('/', adminServiceRoute);
app.use('/', subscriptionRoute);
app.use('/', faqRoute);
app.use('/', bannerRoute);
app.use('/', termsConditionRoute);
app.use('/', privacyPolicyRoute);
app.use('/', authRoute);
app.use('/', userRoute);
app.use('/', contactRoute);
app.use('/', vendorAuth);
app.use('/', vendorManagementRoute);
app.use('/', userManagementRoute);
app.use('/', vendorRoute);
app.use('/', dashbordRoute);
app.use('/', notificationRoute)

const PORT = 4200;

const start = async () => {
    try {
        await connectDb()
        app.listen(PORT,'192.168.0.100',()=>{
            console.log(`express app is running on porn ${PORT}`)
        }); 
    } catch (error) {
        console.log(error);
    } 
}

start();