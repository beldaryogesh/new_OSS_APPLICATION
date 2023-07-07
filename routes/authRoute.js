const express = require('express');

const Router = express.Router();

const authController = require('../controller/authController');

const middlwares = require('../middlwares/midd')

const multer = require('multer');
const update = multer()

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
  
  const upload = multer({ storage: storage });


Router.post('/register' ,upload.single('image'), authController.registerUser);

Router.post('/loginUser', update.none(), authController.loginUser)

Router.post('/verifyotp',update.none(), [middlwares.verifyToken, middlwares.authorize], authController.verifyOtp)

module.exports = Router;



