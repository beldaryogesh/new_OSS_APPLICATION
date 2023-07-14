const express = require("express");
const mongoose = require('mongoose')
const multer = require("multer");
const authRoute = require('./User/routes/authRoute');
const userRoute = require('./User/routes/userRoute'); 
const adminRoute = require('./Admin/routes/adminRoute');
const serviceRoute = require('./Admin/routes/serviceRoute');
const subscriptionRoute = require('./Admin/routes/subscriptionRoute');
const  bannerRoute = require('./Admin/routes/bannerRoute');
const faqRoute = require('./Admin/routes/faqRoute');
const notificatRoute = require('./Admin/routes/notificationRoute');
const termsConditionRoute = require('./Admin/routes/terms&conditionRoute');
const privacyPolicyRoute = require('./Admin/routes/privacyPolicyRoute');
const venderServiceRoute = require('./vendor/routes/vendorServiceRoute');
const app = express();


const URL =
"mongodb+srv://yogesh_beldar:Oh9CU4nZCayFGTeC@cluster0.zveoo.mongodb.net/one-stop-service";
const connectDb = async () => {
  try {
    mongoose.connect(URL, { useNewUrlParser: true });
    console.log("mongoDB is connected");
  } catch (error) {
    console.log(error);
  }
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory where files will be uploaded
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

const upload = multer({storage : storage});
app.use(upload.any());

app.use('/', authRoute);
app.use('/', userRoute);
app.use('/', adminRoute);
app.use('/', serviceRoute);
app.use('/', subscriptionRoute);
app.use('/', bannerRoute);
app.use('/', faqRoute);
app.use('/', notificatRoute);
app.use('/', termsConditionRoute);
app.use('/', privacyPolicyRoute);
app.use('/', venderServiceRoute);

app.use((error, req, res, next)=>{
  const message = `this is the Unexpected field --> ${error.field}`
  return res.status(500).send(message)
})


const PORT = 3000;
const start = async () => {
  try {
    await connectDb();
    app.listen(PORT,()=>{
        console.log(`Express app is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
