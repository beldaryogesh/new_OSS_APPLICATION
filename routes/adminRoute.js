const express = require('express');
const Router = express.Router();
const commonMid = require('../middlwares/midd')
const multer = require('multer');
const update = multer();


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

const adminController = require('../controller/adminController')
const subscriptionController = require('../controller/subscriptionController')


Router.post('/createAdmin',upload.single('image'), adminController.create_admin);

Router.post('/loginAdmin', update.none(), adminController.admin_login)

Router.put('/updateAdmin',[commonMid.verifyToken, commonMid.authorize, commonMid.admin], upload.single('image'),adminController.update_admin);

Router.delete('/deleteAdmin',[commonMid.verifyToken, commonMid.authorize, commonMid.admin], adminController.delete_admin)

module.exports = Router;