const express = require("express");
const mongoose = require('mongoose')
const multer = require("multer");
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute'); 
const adminRoute = require('./routes/adminRoute');
const serviceRoute = require('./routes/serviceRoute');
const subscriptionRoute = require('./routes/subscriptionRoute');
const  bannerRoute = require('./routes/bannerRoute');
const faqRoute = require('./routes/faqRoute');
const notificatRoute = require('./routes/notificationRoute');
const termsConditionRoute = require('./routes/terms&conditionRoute');
const privacyPolicyRoute = require('./routes/privacyPolicyRoute');
const app = express();

app.use('/uploads', express.static('uploads'))

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

app.use('/', authRoute);

app.use('/', userRoute);

app.use('/', adminRoute);

app.use('/', serviceRoute);

app.use('/', subscriptionRoute);

app.use('/', bannerRoute);

app.use('/', faqRoute);

app.use('/', notificatRoute);

app.use('/', termsConditionRoute);

app.use('/', privacyPolicyRoute)

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
