const express = require('express');
const Router = express.Router()
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

const serviceController = require('../controller/serviceController')
const commonMid = require('../middlwares/midd')



Router.post('/addService',upload.single('image'), [commonMid.verifyToken, commonMid.authorize, commonMid.admin], serviceController.add_service)

Router.get('/getService',update.none(),[commonMid.verifyToken, commonMid.authorize, commonMid.admin_seller], serviceController.get_service)

Router.put('/updateService/:id',upload.single('image'), [commonMid.verifyToken, commonMid.authorize, commonMid.admin], serviceController.update_service)

Router.delete('/deleteService/:id',update.none(), [commonMid.verifyToken, commonMid.authorize, commonMid.admin],serviceController.delete_service)


module.exports = Router;








