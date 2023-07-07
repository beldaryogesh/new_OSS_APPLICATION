const express = require('express');
const Router = express.Router();
const commonMid = require('../middlwares/midd')
const usercontroller = require('../controller/userController')
const adminController = require('../controller/adminController')
const multer = require('multer')
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

Router.put('/userUpdate/:id',upload.single('image'),[commonMid.verifyToken, commonMid.authorize],  usercontroller.update_user)
Router.delete('/deleteUser',[commonMid.verifyToken, commonMid.authorize], usercontroller.delete_user)

// customer api
Router.get('/customerList',update.none(), [commonMid.verifyToken, commonMid.authorize, commonMid.admin], usercontroller.get_customer_list);
Router.delete('/deleteUser/:id',update.none(),[commonMid.verifyToken,commonMid.authorize, commonMid.admin], usercontroller.delete_user_by_admin)

// vendor api
Router.get('/vendorList',update.none(),[commonMid.verifyToken, commonMid.authorize, commonMid.admin], usercontroller.get_vendor_list);
Router.delete('/deleteVendor/:id',update.none(),[commonMid.verifyToken, commonMid.authorize, commonMid.admin], usercontroller.delete_user_by_admin);


module.exports = Router;